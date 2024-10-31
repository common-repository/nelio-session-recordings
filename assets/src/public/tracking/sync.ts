/**
 * External dependencies
 */
import type { eventWithTime as Event } from '@rrweb/types';

/**
 * Internal dependencies
 */
import { MAX_LAMBDA_PAYLOAD, getApiUrl } from '../utils/helpers';
import { getChunksBySize } from '../utils/helpers/get-chunks-by-size';
import type { Session } from '../types';

export function sync( events: Array< Event >, session: Session ): void {
	if ( ! events.length ) {
		return;
	} //end if

	track( events, session );
} //end sync()

function track( events: ReadonlyArray< Event >, session: Session ): void {
	if ( session.isStagingSite ) {
		events.forEach(
			( event ) =>
				console.info( '[Staging] Event', JSON.stringify( event ) ) // eslint-disable-line
		);
		return;
	} //end if

	const chunks = getChunksBySize( {
		input: [ ...events ],
		bytesSize: MAX_LAMBDA_PAYLOAD,
	} );

	const { api, site, id } = session;
	const url = getApiUrl( api, `/site/${ site }/session/${ id }`, {
		a: site,
	} );

	for ( const chunk of chunks ) {
		void fetch( url, {
			method: 'POST',
			mode: 'cors',
			body: JSON.stringify( chunk ),
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
			},
		} );
	} //end for
} //end track()
