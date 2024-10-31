/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import '@safe-wordpress/dom-ready';
import '@safe-wordpress/notices';
import { render } from '@safe-wordpress/element';

/**
 * Internal dependencies
 */
import { Layout } from './components/layout';
import { Provider } from './components/provider';
import type { Settings } from './types';

export function initPage( id: string, settings: Settings ): void {
	const content = document.getElementById( id );
	render(
		<div className="wrap">
			<Provider>
				<Layout settings={ settings } />
			</Provider>
		</div>,
		content
	);
} //end initPage()
