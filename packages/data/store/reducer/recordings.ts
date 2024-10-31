/**
 * External dependencies
 */
import type { AnyAction } from '@neliosr/types';

/**
 * Internal dependencies
 */
import { INIT_STATE } from '../config';
import type { State as FullState } from '../types';
import type { RecordingsAction as Action } from '../actions/recordings';

type State = FullState[ 'recordings' ];

export function recordings(
	state = INIT_STATE.recordings,
	action: AnyAction
): State {
	return actualReducer( state, action as Action ) ?? state;
} //end recordings()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'SET_NEXT_BATCH_KEY':
			return {
				...state,
				nextBatchKey: action.key ? { key: action.key } : 'done',
			};

		case 'DISABLE_RECORDINGS':
			if ( ! action.recordingIds.length ) {
				return state;
			} //end if
			return {
				...state,
				items: state.items.filter(
					( r ) => ! action.recordingIds.includes( r.id )
				),
			};

		case 'RECEIVE_ACTIVE_RECORDINGS':
			return {
				...state,
				active: action.activeRecordings,
			};

		case 'RECEIVE_RECORDINGS':
			if ( ! action.recordings.length ) {
				return state;
			} //end if
			return {
				...state,
				items: [ ...state.items, ...action.recordings ],
			};
	} //end switch
} //end actualReducer()
