/**
 * External dependencies
 */
import 'es6-symbol';
import {
	EventType,
	IncrementalSource,
	MouseInteractions,
	record,
	addCustomEvent,
} from 'rrweb';
import type { eventWithTime as Event } from '@rrweb/types';
import type { Mirror } from 'rrweb-snapshot';

/**
 * Internal dependencies
 */
import { sync } from './sync';
import { isGdprAccepted, isValidScope } from './utils';
import {
	INTERVAL_TO_SYNC,
	LONG_SESSION_TIME,
	RAGE_CLICK_COUNT_THRESHOLD,
	RAGE_CLICK_DELTA_TIME_THRESHOLD,
	U_TURN_DELTA_TIME_THRESHOLD,
	cleanText,
} from '../utils/helpers';
import { extractEvents, saveEvent } from '../utils/storage';
import {
	getSessionInfo,
	updatePageHistoryInStoredSession,
	updateSessionInfoWithEventData,
} from '../utils/helpers/internal/session-info';
import { getCssSelector } from '../utils/helpers/get-css-selector';
import { addCookieListener, removeCookieListener } from '../utils/cookies';
import type { Session, StoredSession } from '../types';
import type { NabTrackEvent } from './types';

export function maybeStartTracking( session: Session ): void {
	const id = addCookieListener( () => {
		if ( ! isGdprAccepted( session ) ) {
			return;
		} //end if
		removeCookieListener( id );

		if ( ! isValidScope( session ) ) {
			return;
		} //end if

		startTracking( session );
	} );
} //end maybeStartTracking()

// ========
// INTERNAL
// ========

let lastClickTimestamp = 0;
let currentClickCountBurst = 0;
let isTrackingEnabled = false;
function startTracking( session: Session ): void {
	if ( isTrackingEnabled ) {
		return;
	} //end if

	isTrackingEnabled = true;
	const pageHistory = updatePageHistoryInStoredSession();

	record( {
		emit: ( event ) => {
			event = maybeExtendFullSnapshotEvent( event, pageHistory );
			event = maybeExtendClickEvent( event, record.mirror );
			event = maybeDetectRageClickEvent( event );

			updateSessionInfoWithEventData( event );
			saveEvent( event );
		},
		blockSelector:
			'svg, lottie-player, .swiper-wrapper, .swiper-slide, .elementor-swiper, .swiper-wrapper *, .swiper-slide *, .elementor-swiper *',
		maskAllInputs: true,
		recordCanvas: false,
		recordCrossOriginIframes: false,
		slimDOMOptions: {
			headFavicon: true,
			headWhitespace: true,
			headMetaDescKeywords: true,
			headMetaSocial: true,
			headMetaRobots: true,
			headMetaHttpEquiv: true,
			headMetaAuthorship: true,
			headMetaVerification: true,
		},
		userTriggeredOnInput: true,
	} );

	visits.forEach( ( v ) => addCustomEvent( 'nab-event', v ) );
	visits = [];

	// save events every second
	setInterval( () => {
		if ( ! canEventsBeSynched( session ) ) {
			return;
		} //end if

		extractEvents( ( events ) => {
			sync( [ ...events ], session );
		} );
	}, INTERVAL_TO_SYNC );
} //end startTracking()

let visits: ReadonlyArray< NabTrackEvent > = [];
window.addEventListener(
	'message',
	( event: MessageEvent< Record< string, unknown > > ) => {
		if ( ! isNabEvent( event ) ) {
			return;
		} //end if

		if ( ! isTrackingEnabled ) {
			if ( event.data.value.kind === 'visit' ) {
				visits = [ ...visits, event.data.value ];
			} //end if
			return;
		} //end if

		addCustomEvent( 'nab-event', event.data.value );
	}
);

const isNabEvent = (
	event: MessageEvent< unknown >
): event is MessageEvent< {
	readonly plugin: 'nelio-ab-testing';
	readonly type: 'testing-event';
	readonly value: NabTrackEvent;
} > =>
	!! event.data &&
	typeof event.data === 'object' &&
	'plugin' in event.data &&
	event.data.plugin === 'nelio-ab-testing' &&
	'type' in event.data &&
	event.data.type === 'testing-event' &&
	'value' in event.data &&
	!! event.data.value &&
	typeof event.data.value === 'object' &&
	'kind' in event.data.value &&
	( event.data.value.kind === 'visit' ||
		event.data.value.kind === 'conversion' );

function canEventsBeSynched( session: Session ): boolean {
	const sessionInfo = getSessionInfo();
	if ( ! sessionInfo ) {
		return false;
	} //end if
	const isSessionMeaningful = !! sessionInfo.isMeaningful;
	const isSessionLongEnough =
		sessionInfo.last - sessionInfo.first >= LONG_SESSION_TIME;

	return session.trackShortSessions
		? isSessionMeaningful
		: isSessionMeaningful && isSessionLongEnough;
} //end canEventsBeSynched()

function maybeExtendClickEvent( event: Event, mirror: Mirror ): Event {
	if (
		event.type !== EventType.IncrementalSnapshot ||
		event.data.source !== IncrementalSource.MouseInteraction ||
		event.data.type !== MouseInteractions.Click
	) {
		return event;
	} //end if

	const node = mirror.getNode( event.data.id );
	if (
		! node ||
		[ 'HTML', 'HEAD', 'META', 'LINK', 'SCRIPT', 'STYLE', 'BODY' ].includes(
			node.nodeName
		)
	) {
		return event;
	} //end if

	const element = node as HTMLElement;
	const textContent = cleanText( element );

	return {
		...event,
		data: {
			...event.data,
			clickedElement: {
				selector: getCssSelector( element ),
				isClickable: isClickable( element ),
				...( element.id.length && { id: element.id } ),
				...( !! textContent && {
					text: textContent,
				} ),
			},
		},
	} as Event;
} //end maybeExtendClickEvent()

function maybeDetectRageClickEvent( event: Event ): Event {
	if (
		event.type !== EventType.IncrementalSnapshot ||
		event.data.source !== IncrementalSource.MouseInteraction ||
		event.data.type !== MouseInteractions.Click
	) {
		return event;
	} //end if

	if ( !! lastClickTimestamp ) {
		const delta = event.timestamp - lastClickTimestamp;
		if ( delta < RAGE_CLICK_DELTA_TIME_THRESHOLD ) {
			currentClickCountBurst++;
		} else {
			currentClickCountBurst = 1;
		} //end if
	} //end if

	lastClickTimestamp = event.timestamp;

	if ( currentClickCountBurst >= RAGE_CLICK_COUNT_THRESHOLD ) {
		// Rage click detected.
		event = {
			...event,
			data: {
				...event.data,
				isRageClick: true,
			},
		} as Event;

		// Reset.
		lastClickTimestamp = 0;
		currentClickCountBurst = 0;
	} //end if

	return event;
} //end maybeDetectRageClickEvent()

function maybeExtendFullSnapshotEvent(
	event: Event,
	pageHistory: Pick<
		StoredSession,
		| 'currentPage'
		| 'previousPage'
		| 'secondPreviousPage'
		| 'currentPageTimestamp'
		| 'previousPageTimestamp'
		| 'secondPreviousPageTimestamp'
	>
): Event {
	if ( event.type !== EventType.FullSnapshot ) {
		return event;
	} // end if

	const {
		currentPage,
		previousPage,
		secondPreviousPage,
		currentPageTimestamp,
		previousPageTimestamp,
	} = pageHistory;

	const isRefresh =
		!! currentPage && !! previousPage && currentPage === previousPage;

	const isUTurn =
		!! currentPage &&
		!! previousPage &&
		!! secondPreviousPage &&
		currentPage !== previousPage &&
		currentPage === secondPreviousPage &&
		currentPageTimestamp &&
		previousPageTimestamp &&
		currentPageTimestamp - previousPageTimestamp <=
			U_TURN_DELTA_TIME_THRESHOLD;

	return {
		...event,
		data: {
			...event.data,
			href: window.location.href,
			...( isRefresh && { isRefresh } ),
			...( isUTurn && { isUTurn } ),
		},
	} as Event;
} //end maybeExtendFullSnapshotEvent()

function isClickable( element: HTMLElement ): boolean {
	if ( ! element ) return false;

	if ( 'disabled' in element && element.disabled ) {
		return false;
	} //end if

	// Check if the element has a click event listener directly attached to it.
	if ( element.onclick || element.onmousedown || element.onmouseup ) {
		return true;
	} //end if

	// Check for specific tag names that are typically clickable
	const clickableTags = [
		'A',
		'BUTTON',
		'INPUT',
		'LABEL',
		'SELECT',
		'OPTION',
		'TEXTAREA',
		'SUMMARY',
		'AREA',
	];
	if ( clickableTags.includes( element.tagName ) ) {
		return true;
	}

	// Check for elements with 'role' attribute values that indicate clickability.
	const clickableRoles = [
		'button',
		'link',
		'menuitem',
		'option',
		'tab',
		'checkbox',
		'radio',
		'switch',
	];
	const role = element.getAttribute( 'role' );
	if ( role && clickableRoles.includes( role ) ) {
		return true;
	} //end if

	// Check for specific attributes that suggest clickability
	const clickableAttributes = [
		'href',
		'tabindex',
		'data-clickable',
		'aria-pressed',
		'aria-expanded',
	];
	for ( const attr of clickableAttributes ) {
		if ( element.hasAttribute( attr ) ) {
			return true;
		} //end if
	} //end for

	if ( element.classList.contains( 'wp-block-navigation-item' ) ) {
		return true;
	} //end if

	// Check computed styles that indicate clickability
	const style = window.getComputedStyle( element );
	if ( style.cursor === 'pointer' ) {
		return true;
	} //end if

	if ( style.pointerEvents === 'none' ) {
		return false;
	} //end if

	// Check if the element is within an interactive container
	let parent = element.parentElement;
	while ( parent ) {
		if ( parent.tagName === 'A' || parent.tagName === 'BUTTON' ) {
			return true;
		} //end if
		parent = parent.parentElement;
	} //end while

	return false;
} //end isClickable()
