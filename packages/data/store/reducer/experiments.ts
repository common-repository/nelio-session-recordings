/**
 * External dependencies
 */
import type { AnyAction } from '@neliosr/types';

/**
 * Internal dependencies
 */
import { INIT_STATE } from '../config';
import type { State as FullState } from '../types';
import type { ExperimentAction as Action } from '../actions/experiment';
import { keyBy } from 'lodash';

type State = FullState[ 'experiments' ];

export function experiments(
	state = INIT_STATE.experiments,
	action: AnyAction
): State {
	return actualReducer( state, action as Action ) ?? state;
} //end experiments()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'RECEIVE_EXPERIMENTS':
			return {
				...state,
				...keyBy( action.experiments, 'id' ),
			};
	} //end switch
} //end actualReducer()
