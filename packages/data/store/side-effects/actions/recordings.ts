/**
 * WordPress dependencies
 */
import apiFetch from '@safe-wordpress/api-fetch';
import { dispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { createErrorNotice } from '@neliosr/utils';
import type { SessionRecording } from '@neliosr/types';

/**
 * Internal dependencies
 */
import { STORE_NAME } from '../../config';

export async function removeRecordings(
	recordingIds: ReadonlyArray< SessionRecording[ 'id' ] >
): Promise< void > {
	try {
		dispatch( STORE_NAME ).lock();
		await apiFetch( {
			path: '/neliosr/v1/recordings',
			method: 'DELETE',
			data: { ids: recordingIds },
		} );
		dispatch( STORE_NAME ).disableRecordings( recordingIds );
		dispatch( STORE_NAME ).unlock();
	} catch ( error ) {
		dispatch( STORE_NAME ).unlock();
		createErrorNotice(
			error,
			_x(
				'Error while deleting recordings.',
				'text',
				'nelio-session-recordings'
			)
		);
		throw error;
	} //end try
} //end removeRecordings()
