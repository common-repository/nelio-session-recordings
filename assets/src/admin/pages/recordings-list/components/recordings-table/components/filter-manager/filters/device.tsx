/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { addFilter } from '@safe-wordpress/hooks';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { keys } from 'lodash';
import { MultipleSelectControl } from '@neliosr/components';
import type { SessionRecording } from '@neliosr/types';

/**
 * Internal dependencies
 */
import {
	DeviceFilter,
	FilterComponentProps,
	FilterDescriptionComponentProps,
} from '../../../../../types';

addFilter(
	'neliosr.get_default_device_filter',
	'neliosr.get_default_device_filter',
	(): DeviceFilter => ( {
		type: 'device',
		value: [],
	} )
);

addFilter(
	'neliosr.get_device_filter_overview_description',
	'neliosr.get_device_filter_overview_description',
	() =>
		( {
			filter,
		}: FilterDescriptionComponentProps< DeviceFilter > ): JSX.Element => (
			<span>
				{ filter.value.length
					? filter.value
							.map( ( deviceType ) => DEVICES[ deviceType ] )
							.join( ', ' )
					: _x( 'All devices', 'text', 'nelio-session-recordings' ) }
			</span>
		)
);

addFilter(
	'neliosr.apply_device_filter',
	'neliosr.apply_device_filter',
	(
		value: boolean,
		recording: SessionRecording,
		filter: DeviceFilter
	): boolean =>
		value && filter.value.length
			? filter.value.includes(
					recording.device as DeviceFilter[ 'value' ][ 0 ]
			  )
			: true
);

const DeviceFilterControl = ( {
	filter,
	onChange,
}: FilterComponentProps< DeviceFilter > ): JSX.Element => (
	<MultipleSelectControl
		placeholder={ _x(
			'Select devices…',
			'command',
			'nelio-session-recordings'
		) }
		values={ filter.value }
		options={ keys( DEVICES ).map( ( deviceType ) => ( {
			label:
				DEVICES[ deviceType ] ??
				_x( 'Desktop', 'text', 'nelio-session-recordings' ),
			value: deviceType,
		} ) ) }
		onChange={ ( selection ) =>
			onChange( {
				...filter,
				value: [ ...selection ] as unknown as DeviceFilter[ 'value' ],
			} )
		}
	/>
);

addFilter(
	'neliosr.get_device_filter_component',
	'neliosr.get_device_filter_component',
	() => DeviceFilterControl
);

const DEVICES: Record< DeviceFilter[ 'value' ][ 0 ], string > = {
	desktop: _x( 'Desktop', 'text', 'nelio-session-recordings' ),
	mobile: _x( 'Mobile', 'text', 'nelio-session-recordings' ),
	tablet: _x( 'Tablet', 'text', 'nelio-session-recordings' ),
};
