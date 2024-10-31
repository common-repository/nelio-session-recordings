/**
 * WordPress dependencies
 */
import * as React from '@wordpress/element';
import { SelectControl } from '@wordpress/components';
import { _x } from '@wordpress/i18n';

/**
 * External dependencies
 */
import type { NumberMatch } from '@neliosr/types';
import { keys, max } from 'lodash';

/**
 * Internal dependencies
 */
import { NumberControl } from '../number-control';

const MATCH_LABELS: Record< NumberMatch[ 'matchType' ], string > = {
	'greater-than': _x( 'Greater than', 'text', 'nelio-session-recordings' ),
	'less-than': _x( 'Less than', 'text', 'nelio-session-recordings' ),
	between: _x( 'Between', 'text', 'nelio-session-recordings' ),
};
const MATCH_OPTIONS = keys( MATCH_LABELS ).map(
	( value: NumberMatch[ 'matchType' ] ) => ( {
		value,
		label: MATCH_LABELS[ value ],
	} )
);

export type NumberMatchControlProps = {
	readonly match: NumberMatch;
	readonly label?: string;
	readonly labelMinimum?: string;
	readonly labelMaximum?: string;
	readonly disabled?: boolean;
	readonly onChange: ( newMatch: NumberMatch ) => void;
};

export const NumberMatchControl = (
	props: NumberMatchControlProps
): JSX.Element => {
	const {
		match,
		label = _x( 'Value', 'text', 'nelio-session-recordings' ),
		labelMinimum = _x(
			'Minimum value',
			'text',
			'nelio-session-recordings'
		),
		labelMaximum = _x(
			'Maximum value',
			'text',
			'nelio-session-recordings'
		),
		disabled,
		onChange,
	} = props;
	const { matchType, ...other } = match;

	const onSelectChange = ( value: NumberMatch[ 'matchType' ] ) => {
		if ( value === 'between' ) {
			return onChange( {
				matchType: 'between',
				minMatchValue: 0,
				maxMatchValue: 0,
				...other,
			} );
		} //end if

		if ( value === 'greater-than' ) {
			return onChange( {
				matchType: 'greater-than',
				matchValue: 0,
				...other,
			} );
		} //end if

		return onChange( {
			matchType: value,
			matchValue: 0,
			...other,
		} );
	};

	return (
		<>
			<SelectControl
				value={ matchType }
				options={ MATCH_OPTIONS }
				disabled={ disabled }
				onChange={ onSelectChange }
			/>
			<RangeDimensionControl
				match={ match }
				labelMinimum={ labelMinimum }
				labelMaximum={ labelMaximum }
				disabled={ disabled }
				onChange={ onChange }
			/>
			<SingleDimensionControl
				match={ match }
				label={ label }
				disabled={ disabled }
				onChange={ onChange }
			/>
		</>
	);
};

type RangeDimensionControlProps = {
	readonly match: NumberMatch;
	readonly labelMinimum: string;
	readonly labelMaximum: string;
	readonly disabled?: boolean;
	readonly onChange: ( newMatch: NumberMatch ) => void;
};
const RangeDimensionControl = (
	props: RangeDimensionControlProps
): JSX.Element | null => {
	const { match, labelMinimum, labelMaximum, disabled, onChange } = props;
	if ( match.matchType !== 'between' ) {
		return null;
	} //end if

	return (
		<>
			<NumberControl
				value={ match.minMatchValue }
				min={ 0 }
				label={ labelMinimum }
				disabled={ disabled }
				onChange={ ( newMin ) =>
					onChange( {
						...match,
						minMatchValue: newMin ?? 0,
						maxMatchValue:
							max( [ newMin, match.maxMatchValue ] ) ?? 0,
					} )
				}
			/>
			<NumberControl
				value={ match.maxMatchValue }
				min={ match.minMatchValue ?? 0 }
				label={ labelMaximum }
				disabled={ disabled }
				onChange={ ( newMax ) =>
					onChange( {
						...match,
						maxMatchValue: newMax ?? 0,
						minMatchValue: max( [ 0, match.minMatchValue ] ) ?? 0,
					} )
				}
			/>
		</>
	);
};

type SingleDimensionControlProps = {
	readonly match: NumberMatch;
	readonly label: string;
	readonly disabled?: boolean;
	readonly onChange: ( newMatch: NumberMatch ) => void;
};
const SingleDimensionControl = (
	props: SingleDimensionControlProps
): JSX.Element | null => {
	const { match, label, disabled, onChange } = props;
	if ( match.matchType === 'between' ) {
		return null;
	} //end if

	return (
		<>
			<NumberControl
				value={ match.matchValue }
				min={ 0 }
				label={ label }
				disabled={ disabled }
				onChange={ ( newValue ) =>
					onChange( {
						...match,
						matchValue: newValue ?? 0,
					} )
				}
			/>
		</>
	);
};
