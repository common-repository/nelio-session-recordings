/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import './style.scss';

export const PageTitle = (): JSX.Element => {
	return (
		<h1 className="wp-heading-inline nelio-session-recordings__page-title">
			<span>
				{ _x(
					'Nelio Session Recordings – Settings',
					'text',
					'nelio-session-recordings'
				) }
			</span>
		</h1>
	);
};
