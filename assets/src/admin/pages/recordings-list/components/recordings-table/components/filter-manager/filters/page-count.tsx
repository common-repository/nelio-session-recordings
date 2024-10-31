/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { addFilter } from '@safe-wordpress/hooks';
import { _nx, _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { NumberMatchControl } from '@neliosr/components';
import { doesNumberMatch } from '@neliosr/utils';
import type { SessionRecording } from '@neliosr/types';

/**
 * Internal dependencies
 */
import {
	PageCountFilter,
	FilterComponentProps,
	FilterDescriptionComponentProps,
} from '../../../../../types';

addFilter(
	'neliosr.get_default_page-count_filter',
	'neliosr.get_default_page-count_filter',
	(): PageCountFilter => ( {
		type: 'page-count',
		matchType: 'greater-than',
		matchValue: 0,
	} )
);

addFilter(
	'neliosr.get_page-count_filter_overview_description',
	'neliosr.get_page-count_filter_overview_description',
	() =>
		( {
			filter,
		}: FilterDescriptionComponentProps< PageCountFilter > ): JSX.Element => {
			switch ( filter.matchType ) {
				case 'less-than':
					return (
						<span>
							{ sprintf(
								/* translators: number of pages */
								_nx(
									'Less than %d page',
									'Less than %d pages',
									filter.matchValue,
									'text',
									'nelio-session-recordings'
								),
								filter.matchValue
							) }
						</span>
					);

				case 'greater-than':
					return (
						<span>
							{ sprintf(
								/* translators: number of pages */
								_nx(
									'More than %d page',
									'More than %d pages',
									filter.matchValue,
									'text',
									'nelio-session-recordings'
								),
								filter.matchValue
							) }
						</span>
					);

				case 'between':
					return (
						<span>
							{ sprintf(
								/* translators: 1 -> number of pages 2 -> number of pages */
								_x(
									'Between %1$d and %2$d pages',
									'text',
									'nelio-session-recordings'
								),
								filter.minMatchValue,
								filter.maxMatchValue
							) }
						</span>
					);
			}
		}
);

addFilter(
	'neliosr.apply_page-count_filter',
	'neliosr.apply_page-count_filter',
	(
		value: boolean,
		recording: SessionRecording,
		filter: PageCountFilter
	): boolean => value && doesNumberMatch( filter, recording.pages.length )
);

const PageCountFilterControl = ( {
	filter,
	onChange,
}: FilterComponentProps< PageCountFilter > ): JSX.Element => (
	<NumberMatchControl
		match={ filter }
		label={ _x( 'Page count', 'text', 'nelio-session-recordings' ) }
		labelMinimum={ _x(
			'Minimum page count',
			'text',
			'nelio-session-recordings'
		) }
		labelMaximum={ _x(
			'Maximum page count',
			'text',
			'nelio-session-recordings'
		) }
		onChange={ ( newMatch ) => {
			onChange( { ...filter, ...newMatch } );
		} }
	/>
);

addFilter(
	'neliosr.get_page-count_filter_component',
	'neliosr.get_page-count_filter_component',
	() => PageCountFilterControl
);
