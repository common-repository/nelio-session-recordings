/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Spinner } from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { useEffect } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import $ from 'jquery';
import { STORE_NAME, usePageAttribute } from '@neliosr/data';
import rrwebPlayer from 'rrweb-player';
import 'rrweb-player/dist/style.css';
import {
	EventType,
	type eventWithTime as Event,
	IncrementalSource,
	MouseInteractions,
	type nelioMouseInteractionData,
	type nelioFullSnapshotEvent,
} from '@rrweb/types';
import type { Maybe, SessionRecording } from '@neliosr/types';

/**
 * Internal dependencies
 */
import './style.scss';
import {
	getInactivePeriods,
	getRecordingEvents,
	getValidEvents,
} from './utils';
import classNames from 'classnames';

export const Player = (): JSX.Element => {
	const { setPageAttribute } = useDispatch( STORE_NAME );
	const [ isLocked, setIsLocked ] = usePageAttribute( 'isLocked' );
	const clickAudioFile = useClickAudioFile();
	const recording = useActiveRecording();
	const eventsUrl = recording?.events;

	const [ isSidebarOpen ] = usePageAttribute(
		'recording/isSidebarOpen',
		false
	);

	useEffect( () => {
		if ( ! eventsUrl ) {
			return;
		} //end if

		const fetchEvents = async () => {
			setIsLocked( true );

			const events = await getRecordingEvents( eventsUrl );
			const inactivePeriods = getInactivePeriods( events );
			const validEvents = getValidEvents( events );

			setPageAttribute( 'recording/events', events );
			setPageAttribute( 'recording/validEvents', validEvents );
			setPageAttribute( 'recording/inactivePeriods', inactivePeriods );

			const clickAudio = new Audio( clickAudioFile );

			const player = initPlayer(
				events,
				inactivePeriods,
				recording.device === 'desktop'
			);
			player.addEventListener( 'event-cast', ( event: Event ) => {
				setPageAttribute( 'recording/currentTime', event.timestamp );
				if (
					event.type === EventType.IncrementalSnapshot &&
					event.data.source === IncrementalSource.MouseInteraction &&
					event.data.type === MouseInteractions.Click
				) {
					void clickAudio.play();
				}
			} );
			document
				.querySelector( '.rr-player .switch input[type=checkbox]' )
				?.addEventListener( 'change', ( ev ) =>
					setPageAttribute(
						'recording/skipInactive',
						!! ev.target &&
							'checked' in ev.target &&
							!! ev.target.checked
					)
				);
			setPageAttribute( 'recording/player', player );

			setIsLocked( false );
		};

		void fetchEvents();
	}, [ eventsUrl ] );

	return (
		<div
			className={ classNames( {
				'neliosr-recording-container': true,
				'neliosr-recording-container--is-sidebar-visible':
					isSidebarOpen,
			} ) }
		>
			{ isLocked && (
				<div className="neliosr-recording-container__loading-message">
					<Spinner />
					<p>
						{ _x(
							'Loading session events…',
							'text',
							'nelio-session-recordings'
						) }
					</p>
				</div>
			) }
			<div id="neliosr-recording-player"></div>
		</div>
	);
};

const initPlayer = (
	events: Array< Event >,
	inactivePeriods: Array< [ number, number ] >,
	isDesktop: boolean
) => {
	const player = new rrwebPlayer( {
		target: document.getElementById(
			'neliosr-recording-player'
		) as HTMLElement,
		props: {
			events,
			autoPlay: true,
			inactiveColor: '#fff',
			skipInactive: true,
			tags: {
				'nab-event': 'transparent',
			},
		},
	} );

	// i18n label for skip button.
	const skipLabel = document.querySelector(
		'.rr-controller__btns .switch .label'
	);
	if ( skipLabel ) {
		skipLabel.textContent = _x(
			'Skip inactive periods',
			'command',
			'nelio-session-recordings'
		);
	} //end if

	// Render inactive periods in progress bar.
	const el = document.getElementsByClassName( 'rr-progress__step' ).item( 0 );
	if ( el ) {
		const defaultInactiveNodes = Array.from(
			document.querySelectorAll( '[title="inactive period"]' )
		);
		for ( const n of defaultInactiveNodes ) {
			el.parentElement?.removeChild( n );
		} //end for

		if ( ! events[ 0 ] ) {
			return player;
		} //end if
		const start = events[ 0 ].timestamp;
		const end = ( events[ events.length - 1 ] as Event ).timestamp;
		for ( const [ periodStart, periodEnd ] of inactivePeriods ) {
			// <div title="inactive period" style="width: 14.25%; height: 4px; position: absolute; background: rgb(170, 170, 170); left: 80.31%;"></div>
			const inactiveNode = document.createElement( 'div' );
			inactiveNode.setAttribute(
				'title',
				_x( 'Inactive period', 'text', 'nelio-session-recordings' )
			);
			inactiveNode.setAttribute(
				'style',
				`width: ${ getWidth(
					start,
					end,
					periodStart,
					periodEnd
				) }%; height: 7px; position: absolute; background: #f0f0f1; left: ${ position(
					start,
					end,
					periodStart
				) }%;`
			);
			el.parentNode?.insertBefore( inactiveNode, el.nextSibling );
		} //end for

		for ( const event of events ) {
			const label = getLabel( event );
			if ( ! label ) {
				continue;
			} //end if

			const highlightedNode = document.createElement( 'div' );
			highlightedNode.setAttribute( 'title', label );
			highlightedNode.setAttribute(
				'style',
				`width: 4px; height: 4px; position: absolute; background: #fff; border-radius: 100%;
					transform: translateY(30%); left: ${ position(
						start,
						end,
						event.timestamp
					) }%;`
			);
			el.parentNode?.insertBefore( highlightedNode, el.nextSibling );
		} //end for

		$( '.rr-progress' ).tooltip();
	} //end if

	if ( isDesktop ) {
		document
			.querySelector( '.replayer-mouse' )
			?.classList.remove( 'touch-device' );
	} //end if

	return player;
};

const useActiveRecording = (): Maybe< SessionRecording > =>
	useSelect( ( select ) => {
		const activeRecordingId =
			select( STORE_NAME ).getPageAttribute( 'recording/activeId' );
		return select( STORE_NAME ).getRecording( activeRecordingId );
	} );

const useClickAudioFile = (): Maybe< string > =>
	useSelect( ( select ) =>
		select( STORE_NAME ).getPageAttribute( 'recording/clickAudioFile' )
	);

/**
 * Calculate the tag position (percent) to be displayed on the progress bar.
 *
 * @param startTime - The start time of the session.
 * @param endTime   - The end time of the session.
 * @param tagTime   - The time of the tag.
 * @return The position of the tag. unit: percentage
 */
function position( startTime: number, endTime: number, tagTime: number ) {
	const sessionDuration = endTime - startTime;
	const eventDuration = endTime - tagTime;
	const eventPosition = 100 - ( eventDuration / sessionDuration ) * 100;
	return eventPosition.toFixed( 2 );
}

const getWidth = (
	startTime: number,
	endTime: number,
	tagStart: number,
	tagEnd: number
) => {
	const sessionDuration = endTime - startTime;
	const eventDuration = tagEnd - tagStart;
	const width = ( eventDuration / sessionDuration ) * 100;
	return width.toFixed( 2 );
};

const getLabel = ( e: Event ): Maybe< string > => {
	switch ( e.type ) {
		case EventType.FullSnapshot:
			const snapshotData: nelioFullSnapshotEvent[ 'data' ] = e.data;
			if ( snapshotData.isUTurn ) {
				return _x( 'U-turn', 'text', 'nelio-session-recordings' );
			} //end if

			if ( snapshotData.isRefresh ) {
				return _x(
					'Refreshed page',
					'text',
					'nelio-session-recordings'
				);
			} //end if
			break;

		case EventType.IncrementalSnapshot:
			switch ( e.data.source ) {
				case IncrementalSource.MouseInteraction:
					switch ( e.data.type ) {
						case MouseInteractions.Click:
							const mouseData: nelioMouseInteractionData = e.data;
							if ( mouseData.isRageClick ) {
								return _x(
									'Rage click',
									'text',
									'nelio-session-recordings'
								);
							} //end if

							if (
								mouseData.clickedElement &&
								typeof mouseData.clickedElement.isClickable !==
									'undefined' &&
								! mouseData.clickedElement.isClickable
							) {
								return _x(
									'Dead click',
									'text',
									'nelio-session-recordings'
								);
							} //end if
					} //end switch
			} //end switch
	} //end switch

	return undefined;
};
