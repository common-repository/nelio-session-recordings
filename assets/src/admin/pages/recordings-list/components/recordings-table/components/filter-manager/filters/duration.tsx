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
	DurationFilter,
	FilterComponentProps,
	FilterDescriptionComponentProps,
} from '../../../../../types';

addFilter(
	'neliosr.get_default_duration_filter',
	'neliosr.get_default_duration_filter',
	(): DurationFilter => ( {
		type: 'duration',
		matchType: 'greater-than',
		matchValue: 1,
	} )
);

addFilter(
	'neliosr.get_duration_filter_overview_description',
	'neliosr.get_duration_filter_overview_description',
	() =>
		( {
			filter,
		}: FilterDescriptionComponentProps< DurationFilter > ): JSX.Element => {
			switch ( filter.matchType ) {
				case 'less-than':
					return (
						<span>
							{ sprintf(
								/* translators: number in seconds */
								_nx(
									'Less than %d second',
									'Less than %d seconds',
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
								/* translators: number in seconds */
								_nx(
									'Over %d second',
									'Over %d seconds',
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
								/* translators: 1 -> number in seconds 2 -> number in seconds */
								_x(
									'Between %1$d and %2$d seconds',
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
	'neliosr.apply_duration_filter',
	'neliosr.apply_duration_filter',
	(
		value: boolean,
		recording: SessionRecording,
		filter: DurationFilter
	): boolean => value && doesNumberMatch( filter, recording.duration )
);

const DurationFilterControl = ( {
	filter,
	onChange,
}: FilterComponentProps< DurationFilter > ): JSX.Element => (
	<NumberMatchControl
		match={ filter }
		label={ _x(
			'Duration in seconds',
			'text',
			'nelio-session-recordings'
		) }
		labelMinimum={ _x(
			'Minimum duration in seconds',
			'text',
			'nelio-session-recordings'
		) }
		labelMaximum={ _x(
			'Maximum duration in seconds',
			'text',
			'nelio-session-recordings'
		) }
		onChange={ ( newMatch ) => {
			onChange( { ...filter, ...newMatch } );
		} }
	/>
);

addFilter(
	'neliosr.get_duration_filter_component',
	'neliosr.get_duration_filter_component',
	() => DurationFilterControl
);
