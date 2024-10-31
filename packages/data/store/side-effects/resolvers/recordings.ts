/**
 * WordPress dependencies
 */
import apiFetch from '@safe-wordpress/api-fetch';
import { dispatch, select } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { createErrorNotice } from '@neliosr/utils';
import type { Maybe, SessionRecording } from '@neliosr/types';

/**
 * Internal dependencies
 */
import { STORE_NAME } from '../../config';

export async function getActiveRecordings(): Promise< void > {
	try {
		const activeRecordings = await apiFetch< number >( {
			path: '/neliosr/v1/active-recordings',
		} );
		dispatch( STORE_NAME ).receiveActiveRecordings( activeRecordings );
	} catch ( error ) {
		createErrorNotice(
			error,
			_x(
				'Error while accessing amount of active recordings.',
				'text',
				'nelio-session-recordings'
			)
		);
		throw error;
	} //end try
} //end getActiveRecordings()

export async function getRecordings(): Promise< void > {
	while ( ! select( STORE_NAME ).areAllRecordingsLoaded() ) {
		await fetchNextBatch();
	} //end while
} //end getRecordings()

export async function getRecording( recordingId: string ): Promise< void > {
	try {
		const recording = await apiFetch< SessionRecording >( {
			path: `/neliosr/v1/recording/${ recordingId }`,
		} );
		dispatch( STORE_NAME ).receiveRecordings( [ recording ] );
		dispatch( STORE_NAME ).setPageAttribute(
			'recording/activeId',
			recording.id
		);
	} catch ( error ) {
		createErrorNotice(
			error,
			_x(
				'Error while accessing recording.',
				'text',
				'nelio-session-recordings'
			)
		);
		throw error;
	} //end try
} //end getRecording()

type Response = {
	readonly data: ReadonlyArray< SessionRecording >;
	readonly key: Maybe< string >;
};

async function fetchNextBatch(): Promise< void > {
	try {
		const key = select( STORE_NAME ).getNextBatchKey();
		const response = await apiFetch< Response >( {
			path: key
				? `/neliosr/v1/recordings?key=${ encodeURIComponent( key ) }`
				: '/neliosr/v1/recordings',
		} );
		dispatch( STORE_NAME ).receiveRecordings( response.data );
		dispatch( STORE_NAME ).setNextBatchKey( response.key );
	} catch ( error ) {
		createErrorNotice(
			error,
			_x(
				'Error while accessing recordings.',
				'text',
				'nelio-session-recordings'
			)
		);
		throw error;
	} //end try
} //end fetchNextBatch()
