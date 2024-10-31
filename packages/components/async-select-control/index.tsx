/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';

/**
 * External dependencies
 */
import { AsyncPaginate } from 'react-select-async-paginate';
import type { GroupBase } from 'react-select';
import type { AsyncPaginateProps } from 'react-select-async-paginate';

/**
 * Internal dependencies
 */
import './style.scss';

import { DEFAULT_STYLE } from '../stylized-select-control';

type AdditionalArgs = {
	readonly page: number;
};

export type AsyncSelectControlProps< OptionType > = {
	readonly className?: string;
	readonly disabled?: boolean;
} & Omit<
	AsyncPaginateProps<
		OptionType,
		GroupBase< OptionType >,
		AdditionalArgs,
		false
	>,
	'theme' | 'isDisabled' | 'className' | 'isMulti'
>;

export function AsyncSelectControl< OptionType >( {
	className = '',
	disabled,
	styles,
	...props
}: AsyncSelectControlProps< OptionType > ): JSX.Element {
	return (
		<AsyncPaginate
			className={ `neliosr-async-select-control ${ className }` }
			isDisabled={ disabled }
			/* TODO. Improve this cast. */
			/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any */
			styles={ { ...DEFAULT_STYLE, ...styles } as any }
			menuPortalTarget={ document.body }
			theme={ ( theme ) => ( {
				...theme,
				spacing: {
					...theme.spacing,
					baseUnit: 0,
					controlHeight: 28,
				},
			} ) }
			{ ...props }
		/>
	);
} //end AsyncSelectControl()
