/**
 * External dependencies
 */
import { castArray } from 'lodash';
import type { SessionRecording } from '@neliosr/types';

export type RecordingsAction =
	| ReceiveActiveRecordings
	| ReceiveRecordings
	| DisableRecordings
	| SetNextBatchKey;

export function setNextBatchKey( key?: string ): SetNextBatchKey {
	return {
		type: 'SET_NEXT_BATCH_KEY',
		key,
	};
} // end setNextBatchKey()

export function receiveActiveRecordings(
	activeRecordings: number
): ReceiveActiveRecordings {
	return {
		type: 'RECEIVE_ACTIVE_RECORDINGS',
		activeRecordings,
	};
} //end receiveActiveRecordings()

export function receiveRecordings(
	recordings: SessionRecording | ReadonlyArray< SessionRecording >
): ReceiveRecordings {
	return {
		type: 'RECEIVE_RECORDINGS',
		recordings: castArray( recordings ),
	};
} //end receiveRecordings()

export function disableRecordings(
	recordingIds:
		| SessionRecording[ 'id' ]
		| ReadonlyArray< SessionRecording[ 'id' ] >
): DisableRecordings {
	return {
		type: 'DISABLE_RECORDINGS',
		recordingIds: castArray( recordingIds ),
	};
} //end disableRecordings()

// ============
// HELPER TYPES
// ============

type SetNextBatchKey = {
	readonly type: 'SET_NEXT_BATCH_KEY';
	readonly key?: string;
};

type ReceiveActiveRecordings = {
	readonly type: 'RECEIVE_ACTIVE_RECORDINGS';
	readonly activeRecordings: number;
};

type ReceiveRecordings = {
	readonly type: 'RECEIVE_RECORDINGS';
	readonly recordings: ReadonlyArray< SessionRecording >;
};

type DisableRecordings = {
	readonly type: 'DISABLE_RECORDINGS';
	readonly recordingIds: ReadonlyArray< SessionRecording[ 'id' ] >;
};
