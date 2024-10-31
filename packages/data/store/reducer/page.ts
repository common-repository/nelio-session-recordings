/**
 * External dependencies
 */
import type { AnyAction } from '@neliosr/types';

/**
 * Internal dependencies
 */
import { INIT_STATE } from '../config';
import type { State as FullState } from '../types';
import type { PageAction as Action } from '../actions/page';

type State = FullState[ 'page' ];

export function page( state = INIT_STATE.page, action: AnyAction ): State {
	return actualReducer( state, action as Action ) ?? state;
} //end page()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'SET_PAGE_ATTRIBUTE':
			if ( ! action.name ) {
				return state;
			} //end if

			return {
				...state,
				[ action.name ]: action.value,
			};

		case 'LOCK_UI':
			return {
				...state,
				isLocked: true,
			};

		case 'UNLOCK_UI':
			return {
				...state,
				isLocked: false,
			};
	} //end switch
} //end actualReducer()
