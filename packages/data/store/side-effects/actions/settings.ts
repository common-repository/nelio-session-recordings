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

/**
 * Internal dependencies
 */
import { STORE_NAME } from '../../config';

export async function setRecordingStatus( status: boolean ): Promise< void > {
	try {
		dispatch( STORE_NAME ).lock();
		await apiFetch( {
			path: '/neliosr/v1/recording-status',
			method: 'POST',
			data: { status },
		} );
		dispatch( STORE_NAME ).receiveRecordingStatus( status );
		dispatch( STORE_NAME ).unlock();
	} catch ( e ) {
		createErrorNotice(
			e,
			_x(
				'Recordings status can’t be changed',
				'text',
				'nelio-session-recordings'
			)
		);
		dispatch( STORE_NAME ).unlock();
	} //end if
} //end setRecordingStatus()
