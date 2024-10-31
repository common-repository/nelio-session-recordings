/**
 * WordPress dependencies
 */
import { _x } from '@safe-wordpress/i18n';

export const maybeFixId = ( sessionId: string ): string => {
	return sessionId.startsWith( 'example-' )
		? sessionId.replace(
				'example-',
				`${ _x( 'Example', 'text', 'nelio-session-recordings' ) } `
		  )
		: sessionId;
};
