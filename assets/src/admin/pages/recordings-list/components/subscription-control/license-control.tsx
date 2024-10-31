/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useState } from '@safe-wordpress/element';
import apiFetch from '@safe-wordpress/api-fetch';
import { Button, DropdownMenu, TextControl } from '@safe-wordpress/components';
import { cog, edit, rotateLeft } from '@safe-wordpress/icons';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { trim } from 'lodash';
import { ConfirmationDialog, QuotaMeter } from '@neliosr/components';
import { createErrorNotice } from '@neliosr/utils';

/**
 * Internal dependencies
 */
import { AddonButton } from '../addon-button';
import type { Settings } from '../../types';

export const LicenseControl = ( {
	settings,
}: {
	settings: Settings;
} ): JSX.Element => {
	const { isSubscribed, isStandalone } = settings;
	const [ action, setAction ] = useState< LicenseAction >( 'none' );
	const [ license, setLicense ] = useState( '' );
	const [ isLoading, setIsLoading ] = useState( false );
	const [ isModalVisible, setModalVisible ] = useState( false );

	if ( ! isSubscribed && ! isStandalone ) {
		return <AddonButton settings={ settings } />;
	} //end if

	if ( ! isSubscribed || action === 'change-license' ) {
		return (
			<div className="neliosr-subscription-control neliosr-subscription-control--row">
				<TextControl
					className="neliosr-subscription-control__license"
					disabled={ isLoading }
					value={ license }
					onChange={ ( l ) => setLicense( trim( l ) ) }
					placeholder={
						! isSubscribed
							? _x(
									'Use your license key here…',
									'text',
									'nelio-session-recordings'
							  )
							: _x(
									'New license key here…',
									'text',
									'nelio-session-recordings'
							  )
					}
				/>
				<Button
					className="neliosr-subscription-control__start"
					variant="primary"
					disabled={ ! license }
					onClick={ () => {
						setIsLoading( true );
						void apiFetch( {
							path: '/neliosr/v1/license',
							method: 'POST',
							data: { license },
						} )
							.then( () => window.location.reload() )
							.catch( ( error ) => {
								createErrorNotice(
									error,
									_x(
										'Error while changing license.',
										'text',
										'nelio-session-recordings'
									)
								);
							} )
							.finally( () => {
								setLicense( '' );
								setAction( 'none' );
								setIsLoading( false );
							} );
					} }
				>
					{ isLoading
						? _x( 'Applying…', 'text', 'nelio-session-recordings' )
						: _x( 'Apply', 'command', 'nelio-session-recordings' ) }
				</Button>
				{ action === 'change-license' && (
					<Button
						className="neliosr-subscription-control__cancel"
						variant="secondary"
						onClick={ () => setAction( 'none' ) }
					>
						{ _x(
							'Cancel',
							'command',
							'nelio-session-recordings'
						) }
					</Button>
				) }
			</div>
		);
	} //end if

	return (
		<div className="neliosr-subscription-control neliosr-subscription-control--row">
			<QuotaMeter />
			<DropdownMenu
				className="neliosr-subscription-control__menu"
				icon={ cog }
				label={ _x(
					'License actions',
					'text',
					'nelio-session-recordings'
				) }
				controls={ [
					{
						title: _x(
							'Change license',
							'command',
							'nelio-session-recordings'
						),
						icon: edit,
						onClick: () => setAction( 'change-license' ),
					},
					{
						title: _x(
							'Remove license',
							'command',
							'nelio-session-recordings'
						),
						icon: rotateLeft,
						onClick: () => {
							setAction( 'remove-license' );
							setModalVisible( true );
						},
					},
				] }
			/>
			<ConfirmationDialog
				title={ _x(
					'Remove license',
					'command',
					'nelio-session-recordings'
				) }
				text={ _x(
					'This action will remove the license from your site. Do you want to continue?',
					'user',
					'nelio-session-recordings'
				) }
				confirmLabel={
					isLoading
						? _x( 'Removing…', 'text', 'nelio-session-recordings' )
						: _x(
								'Remove',
								'command (remove license)',
								'nelio-session-recordings'
						  )
				}
				isDestructive
				isCancelEnabled={ ! isLoading }
				isConfirmBusy={ isLoading }
				isConfirmEnabled={ ! isLoading }
				onCancel={ () => {
					setModalVisible( false );
					setAction( 'none' );
				} }
				isOpen={ isModalVisible }
				onConfirm={ () => {
					setIsLoading( true );
					void apiFetch( {
						path: '/neliosr/v1/license',
						method: 'DELETE',
					} )
						.then( () => {
							window.location.reload();
						} )
						.catch( ( error ) => {
							createErrorNotice(
								error,
								_x(
									'Error while removing license.',
									'text',
									'nelio-session-recordings'
								)
							);
						} )
						.finally( () => {
							setModalVisible( false );
							setIsLoading( false );
							setAction( 'none' );
						} );
				} }
			/>
		</div>
	);
};

// ============
// HELPER TYPES
// ============

type LicenseAction = 'none' | 'change-license' | 'remove-license';
