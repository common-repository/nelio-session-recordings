/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { addFilter } from '@safe-wordpress/hooks';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { StringMatchControl } from '@neliosr/components';
import type { SessionRecording } from '@neliosr/types';

/**
 * Internal dependencies
 */
import {
	RefreshedPageFilter,
	FilterComponentProps,
	FilterDescriptionComponentProps,
} from '../../../../../types';
import { doesStringMatch } from '@neliosr/utils';

addFilter(
	'neliosr.get_default_refreshed-page_filter',
	'neliosr.get_default_refreshed-page_filter',
	(): RefreshedPageFilter => ( {
		type: 'refreshed-page',
		matchType: 'includes',
		matchValue: '/',
	} )
);

addFilter(
	'neliosr.get_refreshed-page_filter_overview_description',
	'neliosr.get_refreshed-page_filter_overview_description',
	() =>
		( {
			filter,
		}: FilterDescriptionComponentProps< RefreshedPageFilter > ): JSX.Element => {
			switch ( filter.matchType ) {
				case 'is':
					return (
						<span>
							{ sprintf(
								/* translators: URL */
								_x(
									'is “%s”',
									'text',
									'nelio-session-recordings'
								),
								filter.matchValue
							) }
						</span>
					);
				case 'is-not':
					return (
						<span>
							{ sprintf(
								/* translators: URL */
								_x(
									'is not “%s”',
									'text',
									'nelio-session-recordings'
								),
								filter.matchValue
							) }
						</span>
					);
				case 'includes':
					return (
						<span>
							{ sprintf(
								/* translators: URL or URL portion */
								_x(
									'includes “%s”',
									'text',
									'nelio-session-recordings'
								),
								filter.matchValue
							) }
						</span>
					);
				case 'does-not-include':
					return (
						<span>
							{ sprintf(
								/* translators: URL or URL portion */
								_x(
									'does not include “%s”',
									'text',
									'nelio-session-recordings'
								),
								filter.matchValue
							) }
						</span>
					);
				case 'regex':
					return (
						<span>
							{ sprintf(
								/* translators: regexp */
								_x(
									'matches “%s”',
									'text',
									'nelio-session-recordings'
								),
								filter.matchValue
							) }
						</span>
					);
			} //end switch
		}
);

addFilter(
	'neliosr.apply_refreshed-page_filter',
	'neliosr.apply_refreshed-page_filter',
	(
		value: boolean,
		recording: SessionRecording,
		filter: RefreshedPageFilter
	): boolean =>
		value &&
		( recording.refreshedPages || [] ).some( ( p ) =>
			doesStringMatch( filter, p )
		)
);

const RefreshedPageFilterControl = ( {
	filter,
	onChange,
}: FilterComponentProps< RefreshedPageFilter > ): JSX.Element => (
	<StringMatchControl
		label={ _x( 'Refreshed page', 'text', 'nelio-session-recordings' ) }
		match={ filter }
		onStringMatchChange={ ( newStringMatch ) => {
			onChange( { ...filter, ...newStringMatch } );
		} }
	/>
);

addFilter(
	'neliosr.get_refreshed-page_filter_component',
	'neliosr.get_refreshed-page_filter_component',
	() => RefreshedPageFilterControl
);
