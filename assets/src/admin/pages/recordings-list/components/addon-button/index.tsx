/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useState, useEffect } from '@safe-wordpress/element';
import apiFetch from '@safe-wordpress/api-fetch';
import { Button } from '@safe-wordpress/components';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import interpolateComponents from '@automattic/interpolate-components';
import { ConfirmationDialog } from '@neliosr/components';
import { useAdminUrl } from '@neliosr/data';
import { createErrorNotice } from '@neliosr/utils';
import type {
	Currency,
	FastSpringProduct,
	FastSpringProductId,
} from '@neliosr/types';

/**
 * Internal dependencies
 */
import './style.scss';
import type { Settings } from '../../types';

type AddonButtonProps = {
	readonly settings: Settings;
};
export const AddonButton = ( {
	settings,
}: AddonButtonProps ): JSX.Element | null => {
	const { isSubscribed } = settings;
	const [ isLoading, setIsLoading ] = useState( false );
	const [ isLoadingData, setIsLoadingData ] = useState( false );
	const [ isConfirmationOpen, setIsConfirmationOpen ] = useState( false );
	const [ addonPrice, setAddonPrice ] = useState( '' );
	const recordingsUrl = useAdminUrl( 'admin.php', {
		page: 'nelio-session-recordings',
	} );

	useEffect( () => {
		setIsLoadingData( true );
		void apiFetch< FastspringData >( {
			path: '/nab/v1/fastspring',
		} )
			.then( ( data: FastspringData ) => {
				const { currency, currentPlan } = data;
				const requiredAddonId = ( data.products.find(
					( p ) => p.id === currentPlan
				)?.allowedAddons || [] )[ 0 ];
				const addon = data.products.find(
					( p ) => p.isAddon && p.id === requiredAddonId
				);
				const addonPriceValue = addon?.price[ currency ];
				if ( addonPriceValue ) {
					setAddonPrice(
						formatPrice( addonPriceValue, currency, addon.period )
					);
				} //end if
			} )
			.catch( ( error ) => createErrorNotice( error ) )
			.finally( () => setIsLoadingData( false ) );
	}, [ isSubscribed ] );

	return (
		<>
			<Button
				className="nab-addon-button"
				variant="primary"
				disabled={ isLoading || isLoadingData }
				isBusy={ isLoading }
				onClick={ () => setIsConfirmationOpen( true ) }
			>
				{ getActionButtonLabel( isLoading, addonPrice ) }
			</Button>
			<ConfirmationDialog
				title={ _x(
					'Upgrade your subscription to include session recordings?',
					'text',
					'nelio-session-recordings'
				) }
				text={ interpolateComponents( {
					mixedString: sprintf(
						/* translators: addon price */
						_x(
							'This will include the Nelio Session Recordings addon to your subscription for an additional charge of %s. You will be charged today.',
							'text',
							'nelio-session-recordings'
						),
						`{{strong}}${ addonPrice }{{/strong}}`
					),
					components: {
						strong: <strong />,
					},
				} ) }
				confirmLabel={ _x(
					'Upgrade Now',
					'command',
					'nelio-session-recordings'
				) }
				isOpen={ isConfirmationOpen }
				isConfirmBusy={ isLoading }
				onCancel={ () => setIsConfirmationOpen( false ) }
				onConfirm={ () => {
					setIsLoading( true );
					void apiFetch( {
						path: '/nab/v1/activate/recordings',
						method: 'POST',
					} )
						.then( () => {
							window.location.href = recordingsUrl;
						} )
						.catch( ( error ) => createErrorNotice( error ) )
						.finally( () => {
							setIsLoading( false );
							setIsConfirmationOpen( false );
						} );
				} }
			/>
		</>
	);
};

type FastspringData = {
	readonly currency: Currency;
	readonly currentPlan: FastSpringProductId;
	readonly products: ReadonlyArray< FastSpringProduct >;
};

const formatPrice = (
	price: number,
	currency: Currency,
	period?: 'month' | 'year'
) => {
	const periodText =
		period === 'month'
			? _x( ' / month', 'text', 'nelio-session-recordings' )
			: _x( ' / year', 'text', 'nelio-session-recordings' );
	const priceText = 'EUR' === currency ? `${ price }€` : `US$${ price }`;
	return `${ priceText } ${ periodText }`.trim();
};

function getActionButtonLabel(
	isLoading: boolean,
	addonPrice: string
): string {
	if ( isLoading ) {
		return _x( 'Enabling…', 'text', 'nelio-session-recordings' );
	} //end if

	return addonPrice.length
		? sprintf(
				/* translators: addon price */
				_x( 'Enable for %s', 'text', 'nelio-session-recordings' ),
				addonPrice
		  )
		: _x( 'Enable', 'text', 'nelio-session-recordings' );
} //end getActionButtonLabel()
