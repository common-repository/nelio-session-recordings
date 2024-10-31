/**
 * WordPress dependencies
 */
import baseApiFetch from '@wordpress/api-fetch';
import { format } from '@wordpress/date';
import { addQueryArgs } from '@wordpress/url';

import type { APIFetchOptions } from '@wordpress/api-fetch';

const apiFetch = < T >( options: APIFetchOptions ): Promise< T > => {
	const { url, path } = options;
	const neliosrts = format( 'YmjHi' ).substring( 0, 11 ) + '0';
	return baseApiFetch( {
		...options,
		...( url && {
			url: isRestApiRequest( options )
				? addQueryArgs( url, { neliosrts } )
				: url,
		} ),
		...( path && { path: addQueryArgs( path, { neliosrts } ) } ),
	} );
};

export * from '@wordpress/api-fetch';
export default apiFetch;

// =======
// HELPERS
// =======
const isRestApiRequest = ( options: APIFetchOptions ): boolean =>
	!! options.url?.includes( '/wp-json/' ) ||
	!! options.url?.includes( 'rest_route' ) ||
	!! Object.keys( options ).includes( 'rest_route' );
