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
	UTurnFilter,
	FilterComponentProps,
	FilterDescriptionComponentProps,
} from '../../../../../types';
import { doesStringMatch } from '@neliosr/utils';

addFilter(
	'neliosr.get_default_u-turn_filter',
	'neliosr.get_default_u-turn_filter',
	(): UTurnFilter => ( {
		type: 'u-turn',
		matchType: 'includes',
		matchValue: '/',
	} )
);

addFilter(
	'neliosr.get_u-turn_filter_overview_description',
	'neliosr.get_u-turn_filter_overview_description',
	() =>
		( {
			filter,
		}: FilterDescriptionComponentProps< UTurnFilter > ): JSX.Element => {
			switch ( filter.matchType ) {
				case 'is':
					return (
						<span>
							{ sprintf(
								/* translators: URL */
								_x(
									'in “%s”',
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
									'not in “%s”',
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
	'neliosr.apply_u-turn_filter',
	'neliosr.apply_u-turn_filter',
	(
		value: boolean,
		recording: SessionRecording,
		filter: UTurnFilter
	): boolean =>
		value &&
		( recording.uTurnPages || [] ).some( ( p ) =>
			doesStringMatch( filter, p )
		)
);

const UTurnFilterControl = ( {
	filter,
	onChange,
}: FilterComponentProps< UTurnFilter > ): JSX.Element => (
	<StringMatchControl
		label={ _x( 'U-turn', 'text', 'nelio-session-recordings' ) }
		match={ filter }
		onStringMatchChange={ ( newStringMatch ) => {
			onChange( { ...filter, ...newStringMatch } );
		} }
	/>
);

addFilter(
	'neliosr.get_u-turn_filter_component',
	'neliosr.get_u-turn_filter_component',
	() => UTurnFilterControl
);
