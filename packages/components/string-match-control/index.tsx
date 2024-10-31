/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { SelectControl, TextControl } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { keys } from 'lodash';
import type { StringMatch } from '@neliosr/types';

const MATCH_LABELS: Record< StringMatch[ 'matchType' ], string > = {
	is: _x( 'is equal to', 'text', 'nelio-session-recordings' ),
	'is-not': _x( 'is not equal to', 'text', 'nelio-session-recordings' ),
	includes: _x( 'includes', 'text', 'nelio-session-recordings' ),
	'does-not-include': _x(
		'does not include',
		'text',
		'nelio-session-recordings'
	),
	regex: _x(
		'matches regular expression',
		'text',
		'nelio-session-recordings'
	),
};
const MATCH_OPTIONS = keys( MATCH_LABELS ).map(
	( value: StringMatch[ 'matchType' ] ) => ( {
		value,
		label: MATCH_LABELS[ value ],
	} )
);

export type StringMatchControlProps = {
	readonly label?: string;
	readonly match: StringMatch;
	readonly valueHelp?: string;
	readonly onStringMatchChange: ( newStringMatch: StringMatch ) => void;
};

export const StringMatchControl = (
	props: StringMatchControlProps
): JSX.Element => {
	const {
		label,
		match: { matchType, matchValue },
		valueHelp,
		onStringMatchChange,
	} = props;
	return (
		<>
			<SelectControl
				label={ label }
				value={ matchType }
				options={ MATCH_OPTIONS }
				onChange={ ( newMatchType ) =>
					onStringMatchChange( {
						matchType: newMatchType,
						matchValue,
					} )
				}
			/>
			<TextControl
				placeholder={
					matchType === 'regex'
						? _x(
								'Regular expression',
								'text',
								'nelio-session-recordings'
						  )
						: _x( 'Value', 'text', 'nelio-session-recordings' )
				}
				help={ valueHelp }
				value={ matchValue }
				onChange={ ( newMatchValue ) => {
					onStringMatchChange( {
						matchType,
						matchValue: newMatchValue,
					} );
				} }
			/>
		</>
	);
};
