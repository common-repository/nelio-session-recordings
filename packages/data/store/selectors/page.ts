/**
 * External dependencies
 */
import { Maybe } from '@neliosr/types';

/**
 * Internal dependencies
 */
import { State } from '../types';

export function getPageAttribute< K extends keyof State[ 'page' ] >(
	state: State,
	name: K
): State[ 'page' ][ K ] {
	return state.page[ name ];
} //end getPageAttribute()

export function isLocked( state: State ): boolean {
	return getPageAttribute( state, 'isLocked' );
} //end isLocked()

export function getActiveRecordingId( state: State ): Maybe< string > {
	return getPageAttribute( state, 'recording/activeId' );
} //end getActiveRecordingId()
