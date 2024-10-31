/**
 * WordPress dependencies
 */
import { dispatch as d, registerStore, controls } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { format } from '@neliosr/date';
import type {
	DataControls,
	Maybe,
	OmitFirstArgs,
	PromisifyReturnTypes,
	RemoveReturnTypes,
} from '@neliosr/types';

/**
 * Internal dependencies
 */
import reducer from './reducer';
import * as selectors from './selectors';
import * as realActions from './actions';
import * as sideEffects from './side-effects/actions';
import * as resolvers from './side-effects/resolvers';
import { STORE_NAME } from './config';

export { STORE_NAME } from './config';
export * from './types';

const actions = { ...realActions, ...sideEffects };

registerStore( STORE_NAME, {
	reducer,
	controls,
	// eslint-disable-next-line
	actions: actions as any,
	selectors,
	resolvers,
} );

d( STORE_NAME ).setToday( format( 'Y-m-d', new Date() ) );

// ==========
// TYPESCRIPT
// ==========

import type { State } from './types';

type Actions = RealActions & SideEffectActions;

type RealActions = RemoveReturnTypes<
	Omit< typeof realActions, 'setPageAttribute' >
> & {
	readonly setPageAttribute: < K extends keyof State[ 'page' ] >(
		name: K,
		value: State[ 'page' ][ K ]
	) => void;
};

type SideEffectActions = PromisifyReturnTypes<
	RemoveReturnTypes< typeof sideEffects >
>;

type TypedSelectors = OmitFirstArgs<
	Omit< typeof selectors, 'getPageAttribute' >
> & {
	readonly getPageAttribute: < K extends keyof State[ 'page' ] >(
		name: K
	) => State[ 'page' ][ K ];
};

type ResolvableSelectors = PromisifyReturnTypes<
	Pick< TypedSelectors, keyof typeof resolvers >
>;

type Selectors = TypedSelectors & DataControls< ResolvableSelectors >;

declare module '@wordpress/data' {
	function dispatch( key: typeof STORE_NAME ): Actions;
	function select( key: typeof STORE_NAME ): Selectors;
	function resolveSelect( key: typeof STORE_NAME ): ResolvableSelectors;
}

// Define selector from Nelio A/B Testing's nab/experiments store
declare module '@wordpress/data' {
	function select( key: 'nab/experiments' ): Maybe< {
		getExperimentType: ( name: string ) => Maybe< {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			readonly icon: ( props?: Record< string, any > ) => JSX.Element;
			readonly title: string;
			readonly description: string;
		} >;
	} >;
}
// eslint-disable-next-line
( window as any ).nab?.experimentLibrary?.registerCoreExperiments();
