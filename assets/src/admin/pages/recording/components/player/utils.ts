/**
 * External dependencies
 */
import { sortBy } from 'lodash';
import {
	EventType,
	MediaInteractions,
	MouseInteractions,
	IncrementalSource,
} from '@rrweb/types';
import type {
	eventWithTime as Event,
	nelioFullSnapshotEvent,
	nelioMouseInteractionData,
} from '@rrweb/types';
import { NabEventPayload } from '@neliosr/types';

type StartTimestamp = number;
type EndTimestamp = number;

export const getRecordingEvents = async ( url: string ): Promise< Event[] > => {
	const response = await fetch( url );
	const jsonl = await response.text();
	const lines = jsonl.replaceAll( '}{', '}\n{' ).split( /\n/ );
	let events: Event[] = [];
	lines.forEach( ( line ) => {
		try {
			const e = JSON.parse( line ) as Event;
			events = [ ...events, e ];
		} catch ( error ) {
			// eslint-disable-next-line no-console
			console.log( 'Error parsing line', line );
		}
	} );
	return sortBy( events, 'timestamp' );
};

const SKIP_TIME_THRESHOLD = 2 * 1000;
export const getInactivePeriods = (
	events: Event[]
): [ StartTimestamp, EndTimestamp ][] => {
	if ( ! events[ 0 ] ) {
		return [];
	} //end if

	const inactivePeriods: [ StartTimestamp, EndTimestamp ][] = [];
	let lastActiveTime = events[ 0 ].timestamp;
	for ( const event of events ) {
		if ( ! isUserInteraction( event ) ) continue;
		if ( event.timestamp - lastActiveTime > SKIP_TIME_THRESHOLD ) {
			inactivePeriods.push( [ lastActiveTime, event.timestamp ] );
		} //end if
		lastActiveTime = event.timestamp;
	} //end for

	return inactivePeriods;
}; //end getInactivePeriods()

function isUserInteraction( event: Event ): boolean {
	if ( event.type !== EventType.IncrementalSnapshot ) {
		return false;
	} //end if
	return (
		event.data.source > IncrementalSource.Mutation &&
		event.data.source <= IncrementalSource.Input
	);
} //end isUserInteraction()

export const getValidEvents = (
	events: ReadonlyArray< Event >
): ReadonlyArray< Event > => {
	return events
		.filter( isMeaningful )
		.reduce( ( acc: ReadonlyArray< Event >, e: Event ) => {
			if ( acc.length === 0 ) {
				return [ e ];
			} //end if

			const previous = acc[ acc.length - 1 ] as Event;
			if (
				e.type === EventType.FullSnapshot &&
				previous.type === EventType.Meta
			) {
				const eventData: nelioFullSnapshotEvent[ 'data' ] = e.data;
				if (
					!! eventData.href &&
					previous.data.href === eventData.href
				) {
					return [ ...acc.slice( 0, -1 ), e ];
				} //end if
			} //end if

			return isSimilar( previous, e ) ? [ ...acc ] : [ ...acc, e ];
		}, [] );
};

// =======
// HELPERS
// =======

const isMeaningful = ( e: Event ): boolean => {
	switch ( e.type ) {
		case EventType.DomContentLoaded:
		case EventType.Load:
			return false;
		case EventType.FullSnapshot:
			const eventData: nelioFullSnapshotEvent[ 'data' ] = e.data;
			return !! eventData.href;
		case EventType.Custom:
			return (
				e.data.tag === 'nab-event' &&
				[ 'visit', 'conversion' ].includes(
					( e.data.payload as NabEventPayload ).kind
				)
			);
		case EventType.Plugin:
			return false;
		case EventType.IncrementalSnapshot:
			switch ( e.data.source ) {
				case IncrementalSource.Mutation:
					return false;
				case IncrementalSource.MouseMove:
					return true;
				case IncrementalSource.MouseInteraction:
					switch ( e.data.type ) {
						case MouseInteractions.MouseUp:
						case MouseInteractions.MouseDown:
							return false;
						case MouseInteractions.Click:
							return true;
						case MouseInteractions.ContextMenu:
							return false;
						case MouseInteractions.DblClick:
							return true;
						case MouseInteractions.Focus:
						case MouseInteractions.Blur:
						case MouseInteractions.TouchStart:
						case MouseInteractions.TouchMove_Departed:
						case MouseInteractions.TouchEnd:
						case MouseInteractions.TouchCancel:
							return false;
					} //end switch
					return false;
				case IncrementalSource.Scroll:
				case IncrementalSource.ViewportResize:
					return true;
				case IncrementalSource.Input:
					return !! e.data.userTriggered;
				case IncrementalSource.MediaInteraction:
					switch ( e.data.type ) {
						case MediaInteractions.Play:
						case MediaInteractions.Pause:
							return true;
						case MediaInteractions.RateChange:
						case MediaInteractions.Seeked:
							return false;
						case MediaInteractions.VolumeChange:
							return true;
					} //end switch
					return false;
				case IncrementalSource.StyleSheetRule:
				case IncrementalSource.CanvasMutation:
				case IncrementalSource.Font:
					return false;
				case IncrementalSource.Selection:
					return true;
				case IncrementalSource.StyleDeclaration:
				case IncrementalSource.AdoptedStyleSheet:
					return false;
			} //end switch
			return false;
		case EventType.Meta:
			return true;
	} //end switch
};

const isSimilar = ( a: Event, b: Event ): boolean => {
	if ( a.type === EventType.FullSnapshot && b.type === EventType.Meta ) {
		const eventData: nelioFullSnapshotEvent[ 'data' ] = a.data;
		if ( !! eventData.href && b.data.href === eventData.href ) {
			return true;
		} //end if
	} //end if

	if ( b.type === EventType.FullSnapshot && a.type === EventType.Meta ) {
		const eventData: nelioFullSnapshotEvent[ 'data' ] = b.data;
		if ( !! eventData.href && a.data.href === eventData.href ) {
			return true;
		} //end if
	} //end if

	if ( a.type !== b.type ) {
		return false;
	} //end if

	if (
		a.type !== EventType.IncrementalSnapshot ||
		b.type !== EventType.IncrementalSnapshot
	) {
		return true;
	} //end if

	// Case: EventType.IncrementalSnapshot.
	if ( a.data.source !== b.data.source ) {
		return false;
	} //end if

	if (
		a.data.source === IncrementalSource.MouseInteraction &&
		b.data.source === IncrementalSource.MouseInteraction
	) {
		const aData: nelioMouseInteractionData = a.data;
		const bData: nelioMouseInteractionData = b.data;
		return (
			aData.type === aData.type && aData.isRageClick === bData.isRageClick
		);
	} //end if

	if (
		a.data.source === IncrementalSource.MediaInteraction &&
		b.data.source === IncrementalSource.MediaInteraction
	) {
		return a.data.type === b.data.type;
	} //end if

	return true;
};
