/**
 * External dependencies
 */
import 'es6-symbol';

/**
 * Internal dependencies
 */
import { maybeStartTracking } from './tracking';
import { domReady, getSession } from './utils/helpers';
import { initEventsStore } from './utils/storage';

domReady( function (): void {
	const win = window;
	const run = hasNabReady( win ) ? win.nab.ready : ( cb: () => void ) => cb();
	run( () =>
		initEventsStore( () => {
			const session = getSession();
			if ( ! session ) {
				return;
			} //end if
			maybeStartTracking( session );
		} )
	);
} );

function hasNabReady(
	win: unknown
): win is { nab: { ready: ( cb: () => void ) => void } } {
	return (
		!! win &&
		'object' === typeof win &&
		'nab' in win &&
		!! win.nab &&
		'object' === typeof win.nab &&
		'ready' in win.nab &&
		'function' === typeof win.nab.ready
	);
}
