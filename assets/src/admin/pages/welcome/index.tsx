/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import domReady from '@safe-wordpress/dom-ready';
import '@safe-wordpress/notices';

import { render } from '@safe-wordpress/element';

/**
 * Internal dependencies
 */
import './style.scss';
import { WelcomeBox } from './components/welcome-box';

domReady( () => {
	const content = document.getElementById( 'neliosr-welcome' );
	render( <WelcomeBox />, content );
} );
