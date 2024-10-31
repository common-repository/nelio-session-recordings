/**
 * WordPress dependencies
 */
import apiFetch from '@safe-wordpress/api-fetch';
import { dispatch } from '@safe-wordpress/data';

/**
 * Internal dependencies
 */
import { STORE_NAME } from '../../config';

export async function getRecordingStatus(): Promise< void > {
	try {
		const status = await apiFetch< boolean >( {
			method: 'GET',
			path: '/neliosr/v1/recording-status',
		} );
		dispatch( STORE_NAME ).receiveRecordingStatus( status );
	} catch ( error ) {
		const message = error instanceof Error ? error.message : 'unknown';
		// eslint-disable-next-line
		console.warn(
			`Unable to retrieve recording status. Error: ${ message }`
		);
	} //end try
} //end getRecordingStatus()

export async function getActivePlugins(): Promise< void > {
	try {
		const plugins = await apiFetch< ReadonlyArray< string > >( {
			path: '/neliosr/v1/plugins',
		} );
		dispatch( STORE_NAME ).receivePlugins( plugins );
	} catch ( error ) {
		const message = error instanceof Error ? error.message : 'unknown';
		// eslint-disable-next-line
		console.warn(
			`Unable to retrieve active plugins. Error: ${ message }`
		);
	} //end try
} //end getActivePlugins()
