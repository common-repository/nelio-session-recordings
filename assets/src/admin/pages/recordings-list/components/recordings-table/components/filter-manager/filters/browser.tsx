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
	BrowserFilter,
	FilterComponentProps,
	FilterDescriptionComponentProps,
} from '../../../../../types';

addFilter(
	'neliosr.get_default_browser_filter',
	'neliosr.get_default_browser_filter',
	(): BrowserFilter => ( {
		type: 'browser',
		value: [],
	} )
);

addFilter(
	'neliosr.get_browser_filter_overview_description',
	'neliosr.get_browser_filter_overview_description',
	() =>
		( {
			filter,
		}: FilterDescriptionComponentProps< BrowserFilter > ): JSX.Element => (
			<span>
				{ filter.value.length
					? filter.value
							.map( ( browserType ) => BROWSERS[ browserType ] )
							.join( ', ' )
					: _x( 'All browsers', 'text', 'nelio-session-recordings' ) }
			</span>
		)
);

addFilter(
	'neliosr.apply_browser_filter',
	'neliosr.apply_browser_filter',
	(
		value: boolean,
		recording: SessionRecording,
		filter: BrowserFilter
	): boolean =>
		value && filter.value.length
			? filter.value.includes( getBrowserType( recording.browser ) )
			: true
);

const BrowserFilterControl = ( {
	filter,
	onChange,
}: FilterComponentProps< BrowserFilter > ): JSX.Element => (
	<MultipleSelectControl
		placeholder={ _x(
			'Select browsers…',
			'command',
			'nelio-session-recordings'
		) }
		values={ filter.value }
		options={ keys( BROWSERS ).map( ( browserType ) => ( {
			label:
				BROWSERS[ browserType ] ??
				_x( 'Unknown', 'text', 'nelio-session-recordings' ),
			value: browserType,
		} ) ) }
		onChange={ ( selection ) =>
			onChange( {
				...filter,
				value: [ ...selection ] as unknown as BrowserFilter[ 'value' ],
			} )
		}
	/>
);

addFilter(
	'neliosr.get_browser_filter_component',
	'neliosr.get_browser_filter_component',
	() => BrowserFilterControl
);

const BROWSERS: Record< BrowserFilter[ 'value' ][ 0 ], string > = {
	chrome: 'Chrome',
	'android-browser': 'Android Browser',
	edge: 'Edge',
	firefox: 'Firefox',
	opera: 'Opera',
	safari: 'Safari',
	'internet-explorer': 'Internet Explorer',
	other: _x( 'Other', 'text', 'nelio-session-recordings' ),
};

const getBrowserType = ( type: string ): BrowserFilter[ 'value' ][ 0 ] => {
	if ( type.includes( 'Chrome' ) || type.includes( 'Chromium' ) ) {
		return 'chrome';
	} //end if

	if ( type.includes( 'Android Browser' ) ) {
		return 'android-browser';
	} //end if

	if ( type.includes( 'Edge' ) ) {
		return 'edge';
	} //end if

	if ( type.includes( 'Firefox' ) ) {
		return 'firefox';
	} //end if

	if ( type.includes( 'Opera' ) ) {
		return 'opera';
	} //end if

	if ( type.includes( 'Safari' ) ) {
		return 'safari';
	} //end if

	if ( type.startsWith( 'IE' ) ) {
		return 'internet-explorer';
	} //end if

	return 'other';
};
