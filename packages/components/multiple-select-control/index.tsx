/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useEffect, useRef, useState } from '@safe-wordpress/element';
import { FormTokenField } from '@safe-wordpress/components';
import { _x, sprintf } from '@safe-wordpress/i18n';
import type { RefObject } from 'react';

/**
 * External dependencies
 */
import { noop, isString } from 'lodash';

/**
 * Internal dependencies
 */
import './style.scss';

type Item = {
	readonly value: string;
	readonly label: string;
};

export type MultipleSelectControlProps = {
	readonly values: ReadonlyArray< string >;
	readonly options: ReadonlyArray< Item >;
	readonly placeholder?: string;
	readonly onChange: ( value: ReadonlyArray< string > ) => void;
	readonly disabled?: boolean;
};

export const MultipleSelectControl = ( {
	values = [],
	options,
	disabled,
	placeholder = _x( 'Select…', 'user', 'nelio-session-recordings' ),
	onChange,
}: MultipleSelectControlProps ): JSX.Element => {
	const [ autoExpand, setAutoExpand ] = useState( false ); // NOTE. Workaround.

	const ref = useRef< HTMLDivElement >( null );
	useEffectOnFocusAndBlur( ref, setAutoExpand );

	const onSelectionChange = (
		selection: ReadonlyArray< FormTokenField.Value >
	): void => {
		const str = selection.find( isString ) ?? '';
		const item = findByLabel( str, options );
		onChange(
			[ ...selection, { itemId: item?.value } ]
				.filter( hasItemId )
				.map( ( s ) => s.itemId )
		);
	};

	return (
		<div ref={ ref } className="neliosr-multiple-select-control">
			<FormTokenField
				value={ values.map( ( value ) =>
					itemToFormValue( value, options )
				) }
				disabled={ disabled }
				suggestions={ options
					.filter( ( o ) => ! values.includes( o.value ) )
					.map( ( o ) => o.label ) }
				onChange={ onSelectionChange }
				{ ...{
					label: '',
					__experimentalExpandOnFocus: autoExpand,
					placeholder,
				} }
			/>
		</div>
	);
};

// =======
// HELPERS
// =======

const findByLabel = (
	label: string,
	items: ReadonlyArray< Item >
): Item | undefined =>
	items.find( ( item ) => item.label.toLowerCase() === label.toLowerCase() );

const itemToFormValue = (
	value: string,
	options: ReadonlyArray< Item >
): FormTokenField.Value =>
	( {
		itemId: value,
		value:
			options.find( ( o ) => o.value === value )?.label ??
			sprintf(
				/* translators: item value */
				_x( 'Missing item %s', 'text', 'nelio-session-recordings' ),
				value
			),
	} ) as FormTokenField.Value;

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
const hasItemId = ( p: any ): p is { itemId: string } => !! p.itemId;

// =====
// HOOKS
// =====

const useEffectOnFocusAndBlur = (
	ref: RefObject< HTMLDivElement >,
	callback: ( focus: boolean ) => void = noop
) =>
	useEffect( () => {
		const onFocus = () => callback( true );
		const onBlur = () => callback( false );
		const opts = { capture: true };
		ref.current?.addEventListener( 'focus', onFocus, opts );
		ref.current?.addEventListener( 'blur', onBlur, opts );
		return () => {
			ref.current?.removeEventListener( 'focus', onFocus, opts );
			// eslint-disable-next-line react-hooks/exhaustive-deps
			ref.current?.removeEventListener( 'blur', onBlur, opts );
		};
	}, [ callback, ref ] );
