/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { addFilter } from '@safe-wordpress/hooks';
import { RadioControl, TextControl } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import moment from 'moment';
import { date } from '@neliosr/date';
import type { SessionRecording } from '@neliosr/types';

/**
 * Internal dependencies
 */
import {
	DateFilter,
	FilterComponentProps,
	FilterDescriptionComponentProps,
} from '../../../../../types';
addFilter(
	'neliosr.get_default_date_filter',
	'neliosr.get_default_date_filter',
	(): DateFilter => ( {
		type: 'date',
		condition: 'year',
	} )
);

addFilter(
	'neliosr.get_date_filter_overview_description',
	'neliosr.get_date_filter_overview_description',
	() =>
		( {
			filter,
		}: FilterDescriptionComponentProps< DateFilter > ): JSX.Element => (
			<span>
				{ OPTIONS.find( ( o ) => o.value === filter.condition )
					?.label ||
					_x( 'All recordings', 'text', 'nelio-session-recordings' ) }
			</span>
		)
);

addFilter(
	'neliosr.apply_date_filter',
	'neliosr.apply_date_filter',
	(
		value: boolean,
		recording: SessionRecording,
		filter: DateFilter
	): boolean => {
		const now = new Date();
		const recordingDate = date( 'Y-m-d', recording.first );
		switch ( filter.condition ) {
			case 'day':
				return (
					recordingDate >=
					date( 'Y-m-d', moment( now ).add( -1, 'day' ) )
				);

			case 'week':
				return (
					recordingDate >=
					date( 'Y-m-d', moment( now ).add( -7, 'day' ) )
				);

			case 'fortnight':
				return (
					recordingDate >=
					date( 'Y-m-d', moment( now ).add( -15, 'day' ) )
				);

			case 'month':
				return (
					recordingDate >=
					date( 'Y-m-d', moment( now ).add( -30, 'day' ) )
				);

			case 'quarter':
				return (
					recordingDate >=
					date( 'Y-m-d', moment( now ).add( -3, 'months' ) )
				);

			case 'semester':
				return (
					recordingDate >=
					date( 'Y-m-d', moment( now ).add( -6, 'months' ) )
				);

			case 'year':
				return (
					recordingDate >=
					date( 'Y-m-d', moment( now ).add( -1, 'year' ) )
				);

			case 'custom':
				const start = !! filter.rangeStart
					? recordingDate >= filter.rangeStart
					: value;
				const end = !! filter.rangeEnd
					? recordingDate <= filter.rangeEnd
					: value;
				return start && end;
		} //end switch
	}
);

const DateFilterControl = ( {
	filter,
	onChange,
}: FilterComponentProps< DateFilter > ): JSX.Element => {
	const now = new Date();
	const today = date( 'Y-m-d', now );
	const aYearAgo = date( 'Y-m-d', moment( now ).add( -12, 'months' ) );
	return (
		<>
			<RadioControl
				selected={ filter.condition }
				options={ OPTIONS }
				onChange={ ( selectedCondition ) =>
					onChange( {
						...filter,
						condition: selectedCondition || 'year',
					} )
				}
			/>
			{ filter.condition === 'custom' && (
				<div className="neliosr-custom-date-range-selector">
					<TextControl
						type="date"
						value={ filter.rangeStart || 0 }
						min={ aYearAgo }
						max={ filter.rangeEnd || today }
						label={ _x(
							'Start date',
							'text',
							'nelio-session-recordings'
						) }
						onChange={ ( start ) =>
							onChange( {
								...filter,
								rangeStart: start,
							} )
						}
					/>
					<TextControl
						type="date"
						value={ filter.rangeEnd || 0 }
						min={ filter.rangeStart || aYearAgo }
						max={ today }
						label={ _x(
							'End date',
							'text',
							'nelio-session-recordings'
						) }
						onChange={ ( end ) =>
							onChange( {
								...filter,
								rangeEnd: end,
							} )
						}
					/>
				</div>
			) }
		</>
	);
};

addFilter(
	'neliosr.get_date_filter_component',
	'neliosr.get_date_filter_component',
	() => DateFilterControl
);

const OPTIONS: ReadonlyArray< {
	label: string;
	value: DateFilter[ 'condition' ];
} > = [
	{
		label: _x( 'Last 24 hours', 'text', 'nelio-session-recordings' ),
		value: 'day',
	},
	{
		label: _x( 'Last 7 days', 'text', 'nelio-session-recordings' ),
		value: 'week',
	},
	{
		label: _x( 'Last 15 days', 'text', 'nelio-session-recordings' ),
		value: 'fortnight',
	},
	{
		label: _x( 'Last 30 days', 'text', 'nelio-session-recordings' ),
		value: 'month',
	},
	{
		label: _x( 'Last 3 months', 'text', 'nelio-session-recordings' ),
		value: 'quarter',
	},
	{
		label: _x( 'Last 6 months', 'text', 'nelio-session-recordings' ),
		value: 'semester',
	},
	{
		label: _x( 'Last 12 months', 'text', 'nelio-session-recordings' ),
		value: 'year',
	},
	{
		label: _x( 'Custom date range', 'text', 'nelio-session-recordings' ),
		value: 'custom',
	},
];
