/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import {
	Button,
	CheckboxControl,
	ExternalLink,
	TextControl,
} from '@safe-wordpress/components';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { trim } from 'lodash';
import interpolateComponents from '@automattic/interpolate-components';
import { addFreeTracker } from '@neliosr/utils';

export type WelcomeNewUserProps = {
	readonly initPluginInAws: () => void;
	readonly isPluginBeingInitialized: boolean;
	readonly isPolicyAccepted: boolean;
	readonly license: string;
	readonly setLicense: ( license: string ) => void;
	readonly togglePolicy: ( val: boolean ) => void;
};

export const WelcomeNewUser = ( {
	initPluginInAws,
	isPluginBeingInitialized,
	isPolicyAccepted,
	license,
	setLicense,
	togglePolicy,
}: WelcomeNewUserProps ): JSX.Element => (
	<>
		<p className="neliosr-welcome-message__intro">
			{ interpolateComponents( {
				mixedString: sprintf(
					/* translators: plugin name (Nelio Session Recordings) */
					_x(
						'%s is almost ready!',
						'text',
						'nelio-session-recordings'
					),
					'{{strong}}Nelio Session Recordings{{/strong}}'
				),
				components: { strong: <strong /> },
			} ) }
		</p>

		<p className="neliosr-welcome-message__instructions">
			{ _x(
				'Please type in your license key to start using Nelio Session Recordings:',
				'user',
				'nelio-session-recordings'
			) }
		</p>

		<div className="neliosr-welcome-message__license">
			<TextControl
				disabled={ isPluginBeingInitialized }
				value={ license }
				onChange={ ( l ) => setLicense( trim( l ) ) }
				placeholder={ _x(
					'License Key',
					'text',
					'nelio-session-recordings'
				) }
			/>
		</div>

		<div className="neliosr-welcome-message__policy">
			<CheckboxControl
				label={ interpolateComponents( {
					mixedString: _x(
						'I accept Nelio’s {{tac}}Terms and Conditions{{/tac}} and {{policy}}Privacy Policy{{/policy}}.',
						'user',
						'nelio-session-recordings'
					),
					components: {
						tac: (
							<ExternalLink
								href={ addFreeTracker(
									'https://neliosoftware.com/legal-information/nelio-session-recordings-terms-conditions/'
								) }
							/>
						),
						policy: (
							<ExternalLink
								href={ addFreeTracker(
									'https://neliosoftware.com/privacy-policy-cookies/'
								) }
							/>
						),
					},
				} ) }
				disabled={ isPluginBeingInitialized }
				checked={ isPolicyAccepted }
				onChange={ togglePolicy }
			/>
		</div>

		<div className="neliosr-welcome-message__actions">
			<Button
				className="neliosr-welcome-message__start"
				variant="primary"
				disabled={
					isPluginBeingInitialized || ! isPolicyAccepted || ! license
				}
				onClick={ () => initPluginInAws() }
			>
				{ isPluginBeingInitialized
					? _x( 'Loading…', 'text', 'nelio-session-recordings' )
					: _x(
							'Continue »',
							'command',
							'nelio-session-recordings'
					  ) }
			</Button>
		</div>
	</>
);
