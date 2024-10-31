/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { BaseControl, TextControl } from '@safe-wordpress/components';
import { useInstanceId } from '@safe-wordpress/compose';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { noop } from 'lodash';
import { isEmpty } from '@neliosr/utils';

/**
 * Internal dependencies
 */
import './style.scss';

export type RadioControlProps< TValue extends string > = {
	readonly className?: string;
	readonly disabled?: boolean;
	readonly extraValue?: string;
	readonly help?: string;
	readonly label?: string;
	readonly options: ReadonlyArray< RadioControlOption< TValue > >;
	readonly selected: string;
	readonly onChange: ( val: TValue ) => void;
	readonly onExtraChange?: ( val: string ) => void;
};

export type RadioControlOption< TValue extends string > = {
	readonly value: TValue;
	readonly label: string;
	readonly extra?: string;
};

export const RadioControl = < TValue extends string >( {
	className,
	disabled,
	extraValue,
	help,
	label,
	selected,
	onChange,
	onExtraChange,
	options = [],
}: RadioControlProps< TValue > ): JSX.Element | null => {
	const instanceId = useInstanceId( RadioControl );
	const id = `inspector-radio-control-${ instanceId }`;

	if ( isEmpty( options ) ) {
		return null;
	} //end if

	return (
		<BaseControl
			label={ label }
			id={ id }
			help={ help }
			className={ classnames( className, 'components-radio-control' ) }
		>
			{ options.map( ( option, index ) => (
				<div
					key={ `${ id }-${ index }` }
					className={ classnames(
						'components-radio-control__option',
						disabled && 'components-radio-control__option--disabled'
					) }
				>
					<input
						id={ `${ id }-${ index }` }
						className="components-radio-control__input"
						type="radio"
						name={ id }
						value={ option.value }
						onChange={ ( event ) =>
							onChange( event.target.value as TValue )
						}
						checked={ option.value === selected }
						disabled={ disabled }
						aria-describedby={
							!! help ? `${ id }__help` : undefined
						}
					/>
					<label htmlFor={ `${ id }-${ index }` }>
						{ option.label }
					</label>

					{ !! option.extra && option.value === selected && (
						<div className="components-radio-control__extra-field">
							<TextControl
								value={ extraValue ?? '' }
								placeholder={ option.extra }
								onChange={ onExtraChange ?? noop }
								disabled={ disabled }
							/>
						</div>
					) }
				</div>
			) ) }
		</BaseControl>
	);
};
