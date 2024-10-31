/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';

/**
 * Internal dependencies
 */
import './style.scss';
import { Player } from '../player';
import { Sidebar } from '../sidebar';

export const Layout = (): JSX.Element => (
	<div className="nelio-session-recording-layout">
		<Player />
		<Sidebar />
	</div>
);
