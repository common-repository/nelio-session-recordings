import 'lodash';

declare module 'lodash' {
	interface LoDashStatic {
		keys< K extends string >( object?: Record< K, unknown > ): K[];
		trim< T extends string >( str?: T ): T;
		map< T, K extends keyof T >(
			a: [ T, ...T[] ],
			k: K
		): [ T[ K ], ...T[ K ][] ];
		map< T, K extends keyof T >(
			a: readonly [ T, ...T[] ],
			k: K
		): readonly [ T[ K ], ...T[ K ][] ];
		mapValues< T, TKey extends keyof T, TResult >(
			obj: T | undefined | null,
			iteratee: ( value: T[ TKey ], key: TKey ) => TResult
		): Record< TKey, TResult >;
		toPairs< T, TKey extends keyof T >(
			obj: T | undefined | null
		): [ TKey, T[TKey] ][];
	}
}
