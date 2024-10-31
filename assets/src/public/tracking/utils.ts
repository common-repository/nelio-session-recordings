/**
 * Internal dependencies
 */
import type { Session } from '../types';

export function isGdprAccepted( session: Session ): boolean {
	const { gdprCookie } = session;

	if ( ! gdprCookie.name ) {
		return true;
	} //end if

	const matches = ( pattern: string, value: string ) =>
		0 <=
		pattern
			.split( '*' )
			.reduce(
				( start, search ) =>
					start < 0 ? start : value.indexOf( search, start ),
				0
			);

	return document.cookie
		.split( ';' )
		.map( ( c ) => c.trim() )
		.map( ( c ) => c.split( '=' ) )
		.map( ( [ n, ...v ] ) => [ n, v.join( '=' ) ] )
		.filter(
			( c ): c is [ string, string ] =>
				c[ 0 ] !== undefined && c[ 1 ] !== undefined
		)
		.filter( ( [ n ] ) => matches( gdprCookie.name, n ) )
		.some(
			( [ _, v ] ) => ! gdprCookie.value || matches( gdprCookie.value, v )
		);
} //end isGdprAccepted()

export function isValidScope( session: Session ): boolean {
	const { recordingsScope } = session;
	return (
		! recordingsScope.length ||
		recordingsScope.some( ( s ) => window.location.href.includes( s ) )
	);
} //end isValidScope()
