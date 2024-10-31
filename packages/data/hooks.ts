/**
 * WordPress dependencies
 */
import { useDispatch, useSelect } from '@safe-wordpress/data';

/**
 * Internal dependencies
 */
import { STORE_NAME as NELIOSR_DATA } from './store';
import type { State } from './store/types';

type PageAttributes = Required< State[ 'page' ] >;
export function usePageAttribute< A extends keyof PageAttributes >(
	attr: A,
	defaultValue?: PageAttributes[ A ]
): [ PageAttributes[ A ], ( v: PageAttributes[ A ] ) => void ] {
	const value: PageAttributes[ A ] =
		// TODO. I don’t know how to get this working without the explicit cast.
		useSelect(
			( select ) =>
				select( NELIOSR_DATA ).getPageAttribute(
					attr
				) as PageAttributes[ A ]
		) ?? defaultValue;

	const { setPageAttribute } = useDispatch( NELIOSR_DATA );
	const setValue = ( v: PageAttributes[ A ] ) => setPageAttribute( attr, v );

	return [ value, setValue ];
} // ennd usePageAttribute()

export const useAdminUrl = (
	path: string,
	args: Record< string, string | boolean | number >
): string =>
	useSelect( ( select ) => select( NELIOSR_DATA ).getAdminUrl( path, args ) );

export const useHomeUrl = (
	path: string,
	args: Record< string, string | boolean | number >
): string =>
	useSelect( ( select ) => select( NELIOSR_DATA ).getHomeUrl( path, args ) );
