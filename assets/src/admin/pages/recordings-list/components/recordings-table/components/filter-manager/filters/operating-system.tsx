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
	OperatingSystemFilter,
	FilterComponentProps,
	FilterDescriptionComponentProps,
} from '../../../../../types';

addFilter(
	'neliosr.get_default_os_filter',
	'neliosr.get_default_os_filter',
	(): OperatingSystemFilter => ( {
		type: 'os',
		value: [],
	} )
);

addFilter(
	'neliosr.get_os_filter_overview_description',
	'neliosr.get_os_filter_overview_description',
	() =>
		( {
			filter,
		}: FilterDescriptionComponentProps< OperatingSystemFilter > ): JSX.Element => (
			<span>
				{ filter.value.length
					? filter.value.map( ( type ) => OS[ type ] ).join( ', ' )
					: _x(
							'All operating systems',
							'text',
							'nelio-session-recordings'
					  ) }
			</span>
		)
);

addFilter(
	'neliosr.apply_os_filter',
	'neliosr.apply_os_filter',
	(
		value: boolean,
		recording: SessionRecording,
		filter: OperatingSystemFilter
	): boolean =>
		value && filter.value.length
			? filter.value.includes( getOperatingSystemType( recording.os ) )
			: true
);

const OperatingSystemFilterControl = ( {
	filter,
	onChange,
}: FilterComponentProps< OperatingSystemFilter > ): JSX.Element => (
	<MultipleSelectControl
		placeholder={ _x(
			'Select operating systems…',
			'command',
			'nelio-session-recordings'
		) }
		values={ filter.value }
		options={ keys( OS ).map( ( type ) => ( {
			label:
				OS[ type ] ??
				_x( 'Unknown', 'text', 'nelio-session-recordings' ),
			value: type,
		} ) ) }
		onChange={ ( selection ) =>
			onChange( {
				...filter,
				value: [
					...selection,
				] as unknown as OperatingSystemFilter[ 'value' ],
			} )
		}
	/>
);

addFilter(
	'neliosr.get_os_filter_component',
	'neliosr.get_os_filter_component',
	() => OperatingSystemFilterControl
);

const OS: Record< OperatingSystemFilter[ 'value' ][ 0 ], string > = {
	windows: 'Windows',
	macosx: 'Mac OS X',
	ios: 'iOS',
	android: 'Android',
	ubuntu: 'Ubuntu',
	linux: 'Linux',
	chrome: 'Chrome OS',
	other: _x( 'Other', 'text', 'nelio-session-recordings' ),
};

const getOperatingSystemType = (
	type: string
): OperatingSystemFilter[ 'value' ][ 0 ] => {
	if ( type.startsWith( 'Windows' ) ) {
		return 'windows';
	} //end if

	if ( type.startsWith( 'Mac OS' ) ) {
		return 'macosx';
	} //end if

	if ( type.startsWith( 'iOS' ) ) {
		return 'ios';
	} //end if

	if ( type.startsWith( 'Android' ) ) {
		return 'android';
	} //end if

	if ( type.startsWith( 'Chromium OS' ) ) {
		return 'chrome';
	} //end if

	if ( type.startsWith( 'Ubuntu' ) ) {
		return 'ubuntu';
	} //end if

	if (
		type.startsWith( 'Linux' ) ||
		type.startsWith( 'RedHat' ) ||
		type.startsWith( 'SUSE' ) ||
		type.startsWith( 'Fedora' )
	) {
		return 'linux';
	} //end if

	return 'other';
};
