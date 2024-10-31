/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import apiFetch from '@safe-wordpress/api-fetch';

/**
 * External dependencies
 */
import { trim } from 'lodash';
import { usePageAttribute } from '@neliosr/data';

/**
 * Internal dependencies
 */
import './style.scss';
import Logo from '../../../../../images/full-logo.svg';

import { WelcomeNewUser } from './new-user';

export const WelcomeBox = (): JSX.Element => {
	const [ error ] = usePageAttribute( 'welcome/error', '' );
	const [ isInitializingPlugin, initPlugin ] = usePluginInitializer();
	const [ license, setLicense ] = usePageAttribute( 'welcome/license', '' );
	const [ isPolicyAccepted, togglePolicy ] = usePageAttribute(
		'welcome/isPolicyAccepted',
		false
	);

	return (
		<div className="neliosr-welcome-message">
			<Logo
				className="neliosr-welcome-message__logo"
				title="Nelio Session Recordings"
				alt="Nelio Session Recordings"
			/>

			<WelcomeNewUser
				initPluginInAws={ initPlugin }
				isPluginBeingInitialized={ isInitializingPlugin }
				isPolicyAccepted={ isPolicyAccepted }
				license={ license }
				setLicense={ setLicense }
				togglePolicy={ togglePolicy }
			/>

			{ !! error && (
				<div className="neliosr-welcome-message__error">{ error }</div>
			) }
		</div>
	);
};

// =====
// HOOKS
// =====

const usePluginInitializer = () => {
	const [ _, setError ] = usePageAttribute( 'welcome/error', '' );
	const [ license ] = usePageAttribute( 'welcome/license', '' );
	const [ initting, markAsInitting ] = usePageAttribute(
		'welcome/isPluginBeingInitialized',
		false
	);

	const init = () => {
		markAsInitting( true );
		setError( '' );
		void apiFetch( {
			path: '/neliosr/v1/init-site',
			method: 'POST',
			data: { license },
		} )
			.then( () => window.location.reload() )
			.catch( ( e ) => {
				setError(
					hasMessage( e ) ? e.message : 'Something went wrong'
				);
				markAsInitting( false );
			} );
	};
	return [ initting, init ] as const;
};

const hasMessage = ( e: unknown ): e is { message: string } =>
	!! e &&
	'object' === typeof e &&
	'message' in e &&
	'string' === typeof e.message &&
	!! trim( e.message );
