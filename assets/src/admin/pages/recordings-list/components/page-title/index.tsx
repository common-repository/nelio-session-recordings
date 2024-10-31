/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import {
	ExternalLink,
	Spinner,
	ToggleControl,
} from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import interpolateComponents from '@automattic/interpolate-components';
import { STORE_NAME } from '@neliosr/data';

/**
 * Internal dependencies
 */
import type { Settings } from '../../types';
import './style.scss';

export const PageTitle = ( {
	settings,
}: {
	settings: Settings;
} ): JSX.Element => {
	const { isSubscribed, isStandalone } = settings;
	const isRecordingActive = useIsRecordingActive();
	const { setRecordingStatus } = useDispatch( STORE_NAME );
	const isLocked = useIsLocked();
	const isLoading = useIsLoading();
	return (
		<h1 className="wp-heading-inline nelio-session-recordings__page-title">
			<span>
				{ _x(
					'Session Recordings',
					'text',
					'nelio-session-recordings'
				) }
			</span>
			{ !! isLocked || !! isLoading ? (
				<Spinner />
			) : (
				<ToggleControl
					label={
						! isSubscribed &&
						interpolateComponents( {
							mixedString: _x(
								'{{link}}Get a subscription{{/link}} to activate recordings.',
								'user',
								'nelio-session-recordings'
							),
							components: {
								link: (
									<ExternalLink
										href={
											isStandalone
												? 'https://neliosoftware.com/session-recordings/pricing'
												: 'https://neliosoftware.com/testing/pricing'
										}
									/>
								),
							},
						} )
					}
					className="nelio-session-recordings__toggle"
					checked={ isSubscribed && isRecordingActive }
					// eslint-disable-next-line @typescript-eslint/no-misused-promises
					onChange={ setRecordingStatus }
					{ ...{ disabled: ! isSubscribed } }
				/>
			) }
		</h1>
	);
};

// =====
// HOOKS
// =====

const useIsLoading = () =>
	useSelect( ( select ) => {
		select( STORE_NAME ).getRecordingStatus();
		return ! select( STORE_NAME ).hasFinishedResolution(
			'getRecordingStatus'
		);
	} );

const useIsRecordingActive = () =>
	useSelect( ( select ) => select( STORE_NAME ).getRecordingStatus() );

const useIsLocked = () =>
	useSelect( ( select ) => select( STORE_NAME ).isLocked() );
