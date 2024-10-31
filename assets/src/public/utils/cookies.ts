/**
 * External dependencies
 */
import type { Maybe } from '@neliosr/types';

type CookieName = ( typeof COOKIE_NAMES )[ number ];
type CookieListenerId = string;
type CookieOptions = {
	readonly path: string;
	readonly expires: number;
};

const COOKIE_NAMES = [
	'neliosrCheckWritePermission',
	'neliosrIsVisitorExcluded',
	'neliosrParticipation',
	'neliosrSession',
	'neliosrSessionChecksum',
] as const;

export function setCookie(
	name: CookieName,
	value: number | boolean | string,
	options?: Partial< CookieOptions >
): void {
	const opts: CookieOptions = {
		path: '/',
		expires: 0,
		...( options || {} ),
	};

	let cookie = `${ name }=${ encodeURIComponent( value ) };`;

	if ( 0 < opts.expires ) {
		const expiration = new Date( new Date().getTime() + opts.expires );
		cookie += ` expires=${ expiration.toUTCString() };`;
	} //end if

	cookie += ` path=${ opts.path };`;
	cookie += ' SameSite=None; Secure;';

	document.cookie = cookie;
} //end setCookie()

export function getCookie( name: string ): Maybe< string > {
	const cookies = document.cookie
		.split( ';' )
		.map( ( cookie ) => cookie.trim() )
		.reduce(
			( memo, cookie ) => {
				memo[ cookie.split( '=' )[ 0 ] ?? '' ] =
					cookie.split( '=' )[ 1 ] ?? '';
				return memo;
			},
			{} as Record< string, string >
		);

	if ( ! cookies[ name ] ) {
		return;
	} //end if
	return decodeURIComponent( cookies[ name ] ?? '' );
} //end getCookie()

export function removeCookie( name: string ): void {
	document.cookie = `${ name }=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=None; Secure`;
} //end removeCookie()

export function cleanNsrCookies(): void {
	COOKIE_NAMES.forEach( removeCookie );
} //end cleanNsrCookies()

export function addCookieListener( fn: () => void ): CookieListenerId {
	const id = getNewId();
	listeners[ id ] = fn;
	resetTimeout();
	return id;
} //end addCookieListener()

export function removeCookieListener( name: string ): void {
	if ( listeners[ name ] ) {
		delete listeners[ name ];
	} //end if
} //end removeCookieListener()

// ========
// INTERNAL
// ========

const trackState = {
	timeoutId: undefined as undefined | ReturnType< typeof setInterval >,
	cookie: '',
	counter: 0,
};
const listeners: Record< CookieListenerId, () => void > = {};

function tick() {
	if ( ! trackState.counter || trackState.cookie !== document.cookie ) {
		Object.values( listeners ).forEach( ( fn ) => fn() );
	} //end if
	trackState.cookie = document.cookie ?? '';
	++trackState.counter;

	if ( ! Object.values( listeners ).length ) {
		return;
	} //end if

	trackState.timeoutId = setTimeout(
		tick,
		trackState.counter < 120 ? 500 : 2000
	);
} //end tick()

function resetTimeout() {
	trackState.counter = 0;
	clearInterval( trackState.timeoutId );
	trackState.timeoutId = setTimeout( tick, 500 );
} //end resetTimeout()

const getNewId = () => {
	let id = '';
	do {
		id = `${ Math.random() }`.slice( 2 );
	} while ( Object.keys( listeners ).includes( id ) );
	return id;
};
