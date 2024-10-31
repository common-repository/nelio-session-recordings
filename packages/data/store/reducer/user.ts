/**
 * External dependencies
 */
import type { AnyAction } from '@neliosr/types';

/**
 * Internal dependencies
 */
import { INIT_STATE } from '../config';
import type { State as FullState } from '../types';
import type { SiteAction as Action } from '../actions/user';

type State = FullState[ 'siteQuota' ];

export function siteQuota(
	state = INIT_STATE.siteQuota,
	action: AnyAction
): State {
	return actualReducer( state, action as Action ) ?? state;
} //end siteQuota()

function actualReducer( _: State, action: Action ): State {
	switch ( action.type ) {
		case 'RECEIVE_SITE_QUOTA':
			return action.quota;
	} //end switch
} //end actualReducer()
