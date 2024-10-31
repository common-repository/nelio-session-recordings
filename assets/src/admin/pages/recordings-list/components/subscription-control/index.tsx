/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';

/**
 * External dependencies
 */
import { QuotaMeter } from '@neliosr/components';

/**
 * Internal dependencies
 */
import { LicenseControl } from './license-control';
import type { Settings } from '../../types';

export const SubscriptionControl = ( {
	settings,
}: {
	settings: Settings;
} ): JSX.Element | null => {
	if ( settings.isStandalone ) {
		return <LicenseControl settings={ settings } />;
	} //end if

	if ( settings.isSubscribed ) {
		return (
			<div className="neliosr-subscription-control">
				<QuotaMeter />
			</div>
		);
	} //end if

	return null;
};
