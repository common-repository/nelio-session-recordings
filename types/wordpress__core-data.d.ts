import { SearchQuery } from '@wordpress/core-data';
import { Brand } from 'ts-brand';

declare module '@wordpress/core-data' {
	export const store: Maybe< {
		readonly name: 'core';
	} >;

	export type SearchQuery = {
		readonly search?: string;
		readonly exclude?: ReadonlyArray< number >;
		readonly page?: number;
		// eslint-disable-next-line camelcase
		readonly per_page?: number;
		readonly who?: 'authors';
	};
}

declare module '@wordpress/core-data/selectors' {
	export function isResolving(
		selector: string,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		args: any[]
	): boolean;
	export function hasFinishedResolution(
		selector: string,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		args: any[]
	): boolean;
	export function hasResolutionFailed(
		selector: string,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		args: any[]
	): boolean;
} //end module declaration

// ============
// HELPER TYPES
// ============

type Maybe< T > = T | undefined;

type Url = Brand< string, 'Url' >;
