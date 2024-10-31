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
	ClickedElementFilter,
	FilterComponentProps,
	FilterDescriptionComponentProps,
} from '../../../../../types';
import { doesCssSelectorMatch, doesStringMatch } from '@neliosr/utils';
import { SelectControl } from '@wordpress/components';

addFilter(
	'neliosr.get_default_clicked-element_filter',
	'neliosr.get_default_clicked-element_filter',
	(): ClickedElementFilter => ( {
		type: 'clicked-element',
		subType: 'css-selector',
		matchType: 'includes',
		matchValue: '',
	} )
);

addFilter(
	'neliosr.get_clicked-element_filter_overview_description',
	'neliosr.get_clicked-element_filter_overview_description',
	() =>
		( {
			filter,
		}: FilterDescriptionComponentProps< ClickedElementFilter > ): JSX.Element => {
			let subTypeText = '';
			switch ( filter.subType ) {
				case 'css-selector':
					subTypeText = _x(
						'CSS selector',
						'text',
						'nelio-session-recordings'
					);
					break;
				case 'element-id':
					subTypeText = _x(
						'Element ID',
						'text',
						'nelio-session-recordings'
					);
					break;
				case 'text':
					subTypeText = _x(
						'Button or link text',
						'text',
						'nelio-session-recordings'
					);
					break;
			}
			switch ( filter.matchType ) {
				case 'is':
					return (
						<span>
							{ sprintf(
								/* translators: 1 -> subtype, 2 -> string value */
								_x(
									'%1$s is “%2$s”',
									'text',
									'nelio-session-recordings'
								),
								subTypeText,
								filter.matchValue
							) }
						</span>
					);
				case 'is-not':
					return (
						<span>
							{ sprintf(
								/* translators: 1 -> subtype, 2 -> string value */
								_x(
									'%1$s is not “%2$s”',
									'text',
									'nelio-session-recordings'
								),
								subTypeText,
								filter.matchValue
							) }
						</span>
					);
				case 'includes':
					return (
						<span>
							{ sprintf(
								/* translators: 1 -> subtype, 2 -> string value */
								_x(
									'%1$s includes “%2$s”',
									'text',
									'nelio-session-recordings'
								),
								subTypeText,
								filter.matchValue
							) }
						</span>
					);
				case 'does-not-include':
					return (
						<span>
							{ sprintf(
								/* translators: 1 -> subtype, 2 -> string value */
								_x(
									'%1$s does not include “%2$s”',
									'text',
									'nelio-session-recordings'
								),
								subTypeText,
								filter.matchValue
							) }
						</span>
					);
				case 'regex':
					return (
						<span>
							{ sprintf(
								/* translators: 1 -> subtype, 2 -> string value */
								_x(
									'%1$s matches “%2$s”',
									'text',
									'nelio-session-recordings'
								),
								subTypeText,
								filter.matchValue
							) }
						</span>
					);
			} //end switch
		}
);

addFilter(
	'neliosr.apply_clicked-element_filter',
	'neliosr.apply_clicked-element_filter',
	(
		value: boolean,
		recording: SessionRecording,
		filter: ClickedElementFilter
	): boolean => {
		switch ( filter.subType ) {
			case 'css-selector':
				return (
					value &&
					( recording.clicks
						? recording.clicks.some( ( c ) =>
								doesCssSelectorMatch( filter, c.selector )
						  )
						: true )
				);

			case 'element-id':
				return (
					value &&
					( recording.clicks
						? recording.clicks.some( ( c ) =>
								doesStringMatch( filter, c.id, true )
						  )
						: true )
				);

			case 'text':
				return (
					value &&
					( recording.clicks
						? recording.clicks.some( ( c ) =>
								doesStringMatch(
									filter,
									c.text?.toLowerCase(),
									true
								)
						  )
						: true )
				);
		} //end switch
	}
);

const ClickedElementFilterControl = ( {
	filter,
	onChange,
}: FilterComponentProps< ClickedElementFilter > ): JSX.Element => (
	<>
		<SelectControl
			value={ filter.subType }
			options={ SUBTYPE_OPTIONS }
			onChange={ ( subType ) => onChange( { ...filter, subType } ) }
		/>
		<StringMatchControl
			match={ filter }
			onStringMatchChange={ ( newStringMatch ) => {
				onChange( { ...filter, ...newStringMatch } );
			} }
		/>
	</>
);

const SUBTYPE_OPTIONS: ReadonlyArray< {
	value: ClickedElementFilter[ 'subType' ];
	label: string;
} > = [
	{
		value: 'css-selector',
		label: _x( 'CSS selector', 'text', 'nelio-session-recordings' ),
	},
	{
		value: 'element-id',
		label: _x( 'Element ID', 'text', 'nelio-session-recordings' ),
	},
	{
		value: 'text',
		label: _x( 'Button or link text', 'text', 'nelio-session-recordings' ),
	},
];

addFilter(
	'neliosr.get_clicked-element_filter_component',
	'neliosr.get_clicked-element_filter_component',
	() => ClickedElementFilterControl
);
