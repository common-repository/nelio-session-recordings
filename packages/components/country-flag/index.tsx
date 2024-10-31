/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';

/**
 * External dependencies
 */

/**
 * Internal dependencies
 */
import { Tooltip } from '../tooltip';
import '/node_modules/flag-icons/css/flag-icons.min.css';

type CountryFlagProps = {
	readonly country: string;
	readonly tooltip?: string;
};

export const CountryFlag = ( {
	country,
	tooltip,
}: CountryFlagProps ): JSX.Element =>
	!! tooltip ? (
		<Tooltip text={ tooltip }>
			<div style={ { width: 'min-content' } }>
				<span
					className={ `fi fi-xx fi-${ country.toLowerCase() }` }
				></span>
			</div>
		</Tooltip>
	) : (
		<span className={ `fi fi-xx fi-${ country.toLowerCase() }` }></span>
	);
