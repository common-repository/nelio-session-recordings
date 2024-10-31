/**
 * External dependencies
 */
import type { AnyAction } from '@neliosr/types';

/**
 * Internal dependencies
 */
import { INIT_STATE } from '../config';
import type { State as FullState } from '../types';
import type { SettingsAction as Action } from '../actions/settings';

type State = FullState[ 'settings' ];

export function settings(
	state = INIT_STATE.settings,
	action: AnyAction
): State {
	return actualReducer( state, action as Action ) ?? state;
} //end settings()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'SET_TODAY':
			return {
				...state,
				today: action.today,
			};

		case 'RECEIVE_PLUGINS':
			return {
				...state,
				plugins: action.plugins || [],
			};

		case 'RECEIVE_RECORDING_STATUS':
			return {
				...state,
				recordingStatus: action.recordingStatus,
			};

		case 'RECEIVE_PLUGIN_SETTINGS':
			return {
				...state,
				nelio: action.settings,
			};
	} //end switch
} //end actualReducer()
