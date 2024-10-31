/**
 * External dependencies
 */
import type { Uuid as RealUuid } from 'uuid';

// =======
// GENERIC
// =======

export type Dict< T = unknown > = Record< string, T >;

export type Maybe< T > = T | undefined;

export type AnyAction = Dict & {
	readonly type: string;
};

export type Url = string;

export type Uuid = RealUuid;

export type NonEmptyArray< T > = readonly [ T, ...T[] ];

// =========
// API FETCH
// =========

export type PaginatedResults< T > = {
	readonly results: T;
	readonly pagination: {
		readonly more: boolean;
		readonly pages: number;
	};
};

// ======
// STORES
// ======

export type DataControls<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	RS extends Record< string, ( ...args: any[] ) => unknown >,
> = {
	readonly isResolving: ResolverCheck< RS >;
	readonly hasFinishedResolution: ResolverCheck< RS >;
	readonly hasResolutionFailed: ResolverCheck< RS >;
};

type ResolverCheck<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	RS extends Record< string, ( ...args: any[] ) => unknown >,
> = < K extends keyof RS >( fn: K, args?: Parameters< RS[ K ] > ) => boolean;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type OmitFirstArgs< R extends Record< string, any > > = {
	readonly [ K in keyof R ]: OmitFirstArg< R[ K ] >;
};

export type OmitFirstArg< F > = F extends (
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	x: any,
	...args: infer P
) => infer R
	? ( ...args: P ) => R
	: never;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RemoveReturnTypes< R extends Record< string, any > > = {
	readonly [ K in keyof R ]: RemoveReturnType< R[ K ] >;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RemoveReturnType< F > = F extends ( ...args: infer P ) => any
	? ( ...args: P ) => void
	: never;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PromisifyReturnTypes< R extends Record< string, any > > = {
	readonly [ K in keyof R ]: PromisifyReturnType< R[ K ] >;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PromisifyReturnType< F > = F extends ( ...args: infer P ) => infer R
	? ( ...args: P ) => Promise< R >
	: never;
