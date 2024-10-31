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
import type { Quota } from '@neliosr/types';

/**
 * Internal dependencies
 */
import { STORE_NAME } from '../../config';

export async function getQuota(): Promise< void > {
	try {
		const quota = await apiFetch< Quota >( {
			path: '/neliosr/v1/site/quota',
		} );
		dispatch( STORE_NAME ).receiveSiteQuota( quota );
	} catch ( error ) {
		createErrorNotice(
			error,
			_x(
				'Unable to retrieve quota.',
				'text',
				'nelio-session-recordings'
			)
		);
		throw error;
	} //end try
} //end getQuota()
