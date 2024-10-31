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
	ViewedPageFilter,
	FilterComponentProps,
	FilterDescriptionComponentProps,
} from '../../../../../types';
import { doesStringMatch } from '@neliosr/utils';

addFilter(
	'neliosr.get_default_viewed-page_filter',
	'neliosr.get_default_viewed-page_filter',
	(): ViewedPageFilter => ( {
		type: 'viewed-page',
		matchType: 'includes',
		matchValue: '/',
	} )
);

addFilter(
	'neliosr.get_viewed-page_filter_overview_description',
	'neliosr.get_viewed-page_filter_overview_description',
	() =>
		( {
			filter,
		}: FilterDescriptionComponentProps< ViewedPageFilter > ): JSX.Element => {
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
	'neliosr.apply_viewed-page_filter',
	'neliosr.apply_viewed-page_filter',
	(
		value: boolean,
		recording: SessionRecording,
		filter: ViewedPageFilter
	): boolean =>
		value && recording.pages.some( ( p ) => doesStringMatch( filter, p ) )
);

const ViewedPageFilterControl = ( {
	filter,
	onChange,
}: FilterComponentProps< ViewedPageFilter > ): JSX.Element => (
	<StringMatchControl
		label={ _x( 'Visited page', 'text', 'nelio-session-recordings' ) }
		match={ filter }
		onStringMatchChange={ ( newStringMatch ) => {
			onChange( { ...filter, ...newStringMatch } );
		} }
	/>
);

addFilter(
	'neliosr.get_viewed-page_filter_component',
	'neliosr.get_viewed-page_filter_component',
	() => ViewedPageFilterControl
);
