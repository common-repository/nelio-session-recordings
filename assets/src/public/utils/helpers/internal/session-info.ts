/**
 * External dependencies
 */
import {
	EventType,
	IncrementalSource,
	MediaInteractions,
	MouseInteractions,
} from '@rrweb/types';
import type { Maybe } from '@neliosr/types';
import type { eventWithTime } from '@rrweb/types';

/**
 * Internal dependencies
 */
import { getCookie, setCookie } from '../../cookies';
import { SESSION_MAX_TIME_BETWEEN_EVENTS } from '../constants';
import type { StoredSession } from '../../../types';

// =======
// HELPERS
// =======

export const getSessionInfo = (): Maybe< StoredSession > => {
	const value = getCookie( 'neliosrSession' );
	return value ? ( JSON.parse( value ) as StoredSession ) : undefined;
};

export const updateSessionInfoWithEventData = (
	event: eventWithTime
): void => {
	const value = getCookie( 'neliosrSession' );
	if ( ! value ) {
		return;
	} //end if

	const session = JSON.parse( value ) as StoredSession;
	setCookie(
		'neliosrSession',
		JSON.stringify( {
			...session,
			first: Math.min( session.first, event.timestamp ),
			last: Math.max( session.last, event.timestamp ),
			isMeaningful: !! session.isMeaningful || isMeaningful( event ),
		} ),
		{
			expires: SESSION_MAX_TIME_BETWEEN_EVENTS,
		}
	);
};

export const updatePageHistoryInStoredSession = (): Pick<
	StoredSession,
	| 'currentPage'
	| 'previousPage'
	| 'secondPreviousPage'
	| 'currentPageTimestamp'
	| 'previousPageTimestamp'
	| 'secondPreviousPageTimestamp'
> => {
	const session = getSessionInfo();
	if ( ! session ) {
		return {
			currentPage: window.location.pathname,
		};
	} //end if

	const updatedSession = {
		...session,
		...( !! session.previousPage && {
			secondPreviousPage: session.previousPage,
			secondPreviousPageTimestamp: session.previousPageTimestamp,
		} ),
		...( !! session.currentPage && {
			previousPage: session.currentPage,
			previousPageTimestamp: session.currentPageTimestamp,
		} ),
		currentPage: window.location.pathname,
		currentPageTimestamp: Date.now(),
	};
	setCookie( 'neliosrSession', JSON.stringify( updatedSession ), {
		expires: SESSION_MAX_TIME_BETWEEN_EVENTS,
	} );

	return updatedSession;
};

function isMeaningful( event: eventWithTime ): boolean {
	switch ( event.type ) {
		case EventType.DomContentLoaded:
		case EventType.Load:
		case EventType.FullSnapshot:
		case EventType.Custom:
		case EventType.Plugin:
			return false;
		case EventType.IncrementalSnapshot:
			switch ( event.data.source ) {
				case IncrementalSource.Mutation:
				case IncrementalSource.MouseMove:
					return false;
				case IncrementalSource.MouseInteraction:
					switch ( event.data.type ) {
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
					return !! event.data.userTriggered;
				case IncrementalSource.MediaInteraction:
					switch ( event.data.type ) {
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
			return false;
	} //end switch
}
