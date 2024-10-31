/**
 * External dependencies
 */
import type { Maybe, SessionRecording, Uuid } from '@neliosr/types';

/**
 * Internal dependencies
 */
import { State } from '../types';

export function areAllRecordingsLoaded( state: State ): boolean {
	return state.recordings.nextBatchKey === 'done';
} //end areAllRecordingsLoaded()

export function getNextBatchKey( state: State ): Maybe< string > {
	return ! state.recordings.nextBatchKey ||
		state.recordings.nextBatchKey === 'done'
		? undefined
		: state.recordings.nextBatchKey.key;
} //end getNextBatchKey()

export function getActiveRecordings( state: State ): number {
	return state.recordings.active;
} //end getActiveRecordings()

export function getRecordings(
	state: State
): ReadonlyArray< SessionRecording > {
	return state.recordings.items;
} //end getRecordings()

export function getRecording(
	state: State,
	recordingId?: Uuid
): Maybe< SessionRecording > {
	return state.recordings.items.find( ( r ) => r.id === recordingId );
} //end getRecording()

export function getRecordingAttribute< K extends keyof SessionRecording >(
	state: State,
	key: Uuid,
	attribute: K
): Maybe< SessionRecording[ K ] > {
	const recording = getRecording( state, key );
	if ( ! recording ) {
		return;
	} //end if
	return recording[ attribute ];
} //end getRecordingAttribute()
