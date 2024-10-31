/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { addFilter } from '@safe-wordpress/hooks';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { MultipleSelectControl } from '@neliosr/components';
import { getCountryName, worldCountries } from '@neliosr/utils';
import type { SessionRecording } from '@neliosr/types';

/**
 * Internal dependencies
 */
import {
	CountryFilter,
	FilterComponentProps,
	FilterDescriptionComponentProps,
} from '../../../../../types';

addFilter(
	'neliosr.get_default_country_filter',
	'neliosr.get_default_country_filter',
	(): CountryFilter => ( {
		type: 'country',
		value: [],
	} )
);

addFilter(
	'neliosr.get_country_filter_overview_description',
	'neliosr.get_country_filter_overview_description',
	() =>
		( {
			filter,
		}: FilterDescriptionComponentProps< CountryFilter > ): JSX.Element => (
			<span>
				{ filter.value.length
					? filter.value
							.map( ( country ) =>
								getCountryName( country.toUpperCase() )
							)
							.join( ', ' )
					: _x(
							'All countries',
							'text',
							'nelio-session-recordings'
					  ) }
			</span>
		)
);

addFilter(
	'neliosr.apply_country_filter',
	'neliosr.apply_country_filter',
	(
		value: boolean,
		recording: SessionRecording,
		filter: CountryFilter
	): boolean =>
		filter.value.length ? filter.value.includes( recording.country ) : value
);

const CountryFilterControl = ( {
	filter,
	onChange,
}: FilterComponentProps< CountryFilter > ): JSX.Element => (
	<MultipleSelectControl
		placeholder={ _x(
			'Select countries…',
			'command',
			'nelio-session-recordings'
		) }
		values={ filter.value }
		options={ Object.keys( worldCountries ).map( ( countryCode ) => ( {
			label: getCountryName( countryCode.toUpperCase() ),
			value: countryCode,
		} ) ) }
		onChange={ ( selection ) =>
			onChange( { ...filter, value: [ ...selection ] } )
		}
	/>
);

addFilter(
	'neliosr.get_country_filter_component',
	'neliosr.get_country_filter_component',
	() => CountryFilterControl
);
