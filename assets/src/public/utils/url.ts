/**
 * Internal dependencies
 */
import type { ParamValue } from '../types';

export function buildUrl(
	url: string,
	args: Record< string, ParamValue | undefined > = {},
	hash?: string
): string {
	const keys = Object.keys( args );
	if ( keys.length ) {
		url +=
			'?' +
			keys
				.filter( ( k ) => undefined !== args[ k ] )
				.map(
					( key ) =>
						`${ key }=${ encodeURIComponent( args[ key ] ?? '' ) }`
				)
				.map( ( arg ) =>
					/=$/.test( arg ) ? arg.slice( 0, -1 ) : arg
				)
				.reduce( ( search, pair ) => `${ search }&${ pair }` );
	} //end if

	if ( hash ) {
		url += '#' + hash;
	} //end if

	return url;
} //end buildUrl()

export function removeArgsAndHash( url: string ): string {
	const { cleanUrl } = fragments( url );
	return cleanUrl;
} //end removeArgsAndHash()

export function getHash( url: string ): string {
	const { hash } = fragments( url );
	return hash;
} //end getHash()

export function addQueryArgs(
	url: string,
	args?: Record< string, ParamValue | undefined >
): string {
	args = args ?? {};
	const { cleanUrl, hash } = fragments( url );

	const newArgs = {
		...getQueryArgs( url ),
		...args,
	};
	return buildUrl( cleanUrl, newArgs, hash );
} //end addQueryArgs()

export function removeQueryArgs(
	url: string,
	...names: ReadonlyArray< string >
): string {
	url = url || '';

	if ( 0 === names.length ) {
		return url;
	} //end if

	const { cleanUrl, hash } = fragments( url );

	const args = getQueryArgs( url );
	for ( const key of names ) {
		delete args[ key ];
	} //end for

	return buildUrl( cleanUrl, args, hash );
} //end removeQueryArgs()

export function getQueryArgs( url: string ): Record< string, string > {
	const { search } = fragments( url );
	if ( ! search ) {
		return {};
	} //end if
	const args = search.split( '&' );
	return args.reduce(
		( res, arg ) => {
			const [ key, value = '' ] = arg.split( '=' );
			if ( key ) {
				res[ key ] = decodeURIComponent( value );
			} //end if
			return res;
		},
		{} as Record< string, string >
	);
} //end getQueryArgs()

// =======
// HELPERS
// =======

function fragments( url: string ) {
	const baseUrl =
		0 <= url.indexOf( '#' ) ? url.substr( 0, url.indexOf( '#' ) ) : url;
	const hash =
		0 <= url.indexOf( '#' ) ? url.substr( url.indexOf( '#' ) + 1 ) : '';

	const cleanUrl =
		0 <= baseUrl.indexOf( '?' )
			? baseUrl.substr( 0, baseUrl.indexOf( '?' ) )
			: baseUrl;

	const search =
		0 <= baseUrl.indexOf( '?' )
			? baseUrl.substr( baseUrl.indexOf( '?' ) + 1 )
			: '';

	return {
		cleanUrl,
		search,
		hash,
	};
} //end fragments()
