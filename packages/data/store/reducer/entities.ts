/**
 * External dependencies
 */
import { keyBy } from 'lodash';
import type { AnyAction } from '@neliosr/types';

/**
 * Internal dependencies
 */
import { INIT_STATE } from '../config';
import type { State as FullState } from '../types';
import type { EntityAction as Action } from '../actions/entities';

type State = FullState[ 'entities' ];

export function entities(
	state = INIT_STATE.entities,
	action: AnyAction
): State {
	return actualReducer( state, action as Action ) ?? state;
} //end entities()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'RECEIVE_TYPE_QUERY':
			return {
				...state,
				config: action.kindEntities,
			};

		case 'RECEIVE_ITEMS':
			return {
				...state,
				data: {
					...state.data,
					[ action.kind ]: {
						...state.data[ action.kind ],
						...keyBy( action.items, 'id' ),
					},
				},
			};
	} //end switch
} //end actualReducer()
