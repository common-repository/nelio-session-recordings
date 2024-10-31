/**
 * WordPress dependencies
 */
import apiFetch from '@safe-wordpress/api-fetch';
import { dispatch } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import type { Experiment, ExperimentId } from '@neliosr/types';

/**
 * Internal dependencies
 */
import { STORE_NAME as NSR_DATA } from '../../config';

export async function getExperiment( id: ExperimentId ): Promise< void > {
	try {
		const experiment = await apiFetch< Experiment >( {
			path: `/neliosr/v1/experiment/${ id }`,
		} );
		dispatch( NSR_DATA ).receiveExperiments( experiment );
	} catch ( error ) {
		const message = error instanceof Error ? error.message : 'unknown';
		// eslint-disable-next-line
		console.warn(
			`Unable to retrieve experiment ${ id }. Error: ${ message }.`
		);
	} //end try
} //end getExperiment()
