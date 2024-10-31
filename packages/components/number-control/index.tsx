/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { TextControl } from '@safe-wordpress/components';

/**
 * External dependencies
 */
import type { Maybe } from '@neliosr/types';

export type NumberControlProps = {
	readonly id?: string;
	readonly label?: string;
	readonly className?: string;
	readonly value?: number | string;
	readonly onChange: ( val?: number ) => void;
	readonly min?: number;
	readonly max?: number;
	readonly disabled?: boolean;
	readonly placeholder?: string;
};

// NOTE. NumberControl should come from @wordpress/components.
export const NumberControl = ( {
	id,
	className,
	label,
	value,
	onChange,
	min = -Infinity,
	max = Infinity,
	disabled,
	placeholder,
}: NumberControlProps ): JSX.Element => {
	if ( ! label ) {
		return (
			<input
				id={ id }
				className={ className }
				type="number"
				disabled={ disabled }
				min={ min }
				max={ max }
				defaultValue={ numberize( value ) }
				placeholder={ placeholder }
				onChange={ ( ev ) => {
					const newValue = Number.parseInt( ev.target.value );
					return undefined === newValue ||
						Number.isNaN( newValue ) ||
						newValue < min ||
						max < newValue
						? onChange( undefined )
						: onChange( newValue );
				} }
			/>
		);
	} //end if

	return (
		<TextControl
			id={ id }
			className={ className }
			type="number"
			disabled={ disabled }
			min={ min }
			max={ max }
			label={ label }
			value={ undefined === value ? '' : `${ value }` }
			placeholder={ placeholder }
			onChange={ ( input ) => {
				const newValue = Number.parseInt( input );
				return undefined === newValue ||
					Number.isNaN( newValue ) ||
					newValue < min ||
					max < newValue
					? onChange( undefined )
					: onChange( newValue );
			} }
		/>
	);
};

// =======
// HELPERS
// =======

function numberize( value: NumberControlProps[ 'value' ] ): Maybe< number > {
	if ( 'number' === typeof value ) {
		return value;
	} //end if

	if ( 'string' !== typeof value ) {
		return undefined;
	} //end if

	const num = Number.parseInt( value );
	return isNaN( num ) ? undefined : num;
} //end numberize()
