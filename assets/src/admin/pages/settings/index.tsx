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
import type { Settings } from './types';
import { Layout } from './components/layout';
import './style.scss';

export function initPage( id: string, settings: Settings ): void {
	const content = document.getElementById( id );
	render(
		<div className="wrap">
			<Layout settings={ settings } />
		</div>,
		content
	);
} //end initPage()
