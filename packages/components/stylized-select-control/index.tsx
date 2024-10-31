/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';

/**
 * External dependencies
 */
import Select from 'react-select';
import { isArray } from 'lodash';
import type { Props as SelectProps, StylesConfig } from 'react-select';

const WORDPRESS_TEXT_COLOR = '#32373c';
const WORDPRESS_ACCENT_COLOR = '#007cba';

/**
 * Internal dependencies
 */
import './style.scss';

export const DEFAULT_STYLE: StylesConfig = {
	control: ( _, state ) => ( {
		...getControlBorder( state ),
		background: state.isDisabled ? '#f7f7f7' : '#fff',
		boxShadow: state.isFocused
			? `0 0 0 1px ${ WORDPRESS_ACCENT_COLOR }`
			: undefined,
		display: 'flex',
		flexDirection: 'row',
		fontSize: '14px',
		height: ! state.isMulti ? '26px' : undefined,
		margin: '1px',
		padding: '0 0.5em',
		paddingLeft: state.isMulti ? '0' : undefined,
	} ),

	input: ( style ) => ( {
		...style,
		marginTop: '-3px',
	} ),

	groupHeading: ( style ) => ( {
		...style,
		padding: '1em',
	} ),

	loadingIndicator: () => ( {
		display: 'none',
	} ),

	indicatorSeparator: () => ( {
		display: 'none',
	} ),

	dropdownIndicator: ( _, state ) => ( {
		display: 'flex',
		color: state.isDisabled ? '#c1c4c7' : '#555',
	} ),

	menuPortal: ( style ) => {
		const numberify = ( x: unknown ): number => {
			if ( 'number' === typeof x ) {
				return x;
			} //end if
			return 'string' === typeof sl ? Number.parseInt( sl ) || 0 : 0;
		};

		const margin = 14;
		const width = Math.min( document.body.clientWidth - 2 * margin, 300 );
		const sl: unknown = isArray( style.left )
			? style.left[ 0 ]
			: style.left;
		const styleLeft = numberify( sl );

		const overflowX = Math.abs(
			Math.min(
				0,
				document.body.clientWidth - ( styleLeft + width + 14 )
			)
		);
		const left = styleLeft - overflowX;

		return {
			...style,
			zIndex: '1000001',
			width,
			left,
			right: left + width - margin,
		};
	},

	menu: ( style ) => ( {
		...style,
		borderRadius: 0,
	} ),

	option: ( style, state ) => ( {
		...style,
		...getOptionColor( state ),
		padding: '0.5em 1em',
	} ),
};

export type StylizedSelectControlProps<
	OptionType,
	IsMulti extends boolean,
> = {
	readonly className?: string;
	readonly disabled?: boolean;
} & Omit<
	SelectProps< OptionType, IsMulti >,
	'isDisabled' | 'menuPortalTarget'
>;

export function StylizedSelectControl< OptionType, IsMulti extends boolean >( {
	className = '',
	disabled,
	styles = {},
	...props
}: StylizedSelectControlProps< OptionType, IsMulti > ): JSX.Element {
	return (
		<Select
			className={ `neliosr-stylized-select-control ${ className }` }
			/* TODO. Improve this cast. */
			/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any */
			styles={ { ...DEFAULT_STYLE, ...styles } as any }
			isDisabled={ disabled }
			menuPortalTarget={ document.body }
			{ ...props }
		></Select>
	);
} //end StylizedSelectControl()

// =======
// HELPERS
// =======

const getControlBorder = ( {
	isDisabled,
	isFocused,
}: Partial< {
	isDisabled: boolean;
	isFocused: boolean;
} > = {} ) => {
	let color = '#7e8993';

	if ( isFocused ) {
		color = WORDPRESS_ACCENT_COLOR;
	} //end if

	if ( isDisabled ) {
		color = '#dddddd';
	} //end if

	return {
		border: `1px solid ${ color }`,
		borderRadius: '3px',
	};
};

const getOptionColor = ( {
	isSelected,
	isFocused,
}: Partial< {
	isSelected: boolean;
	isFocused: boolean;
} > = {} ) => {
	let color = WORDPRESS_TEXT_COLOR;
	let background = '#fff';

	if ( isSelected ) {
		background = '#f1f1f1';
	} //end if

	if ( isFocused ) {
		color = '#fff';
		background = WORDPRESS_ACCENT_COLOR;
	} //end if

	return { background, color };
};
