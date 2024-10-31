/**
 * External dependencies
 */
import { get } from 'lodash';
import type {
	EntityId,
	EntityInstance,
	EntityKind,
	EntityKindName,
	Maybe,
} from '@neliosr/types';

/**
 * Internal dependencies
 */
import { State } from '../types';

export function getKindEntities( state: State ): ReadonlyArray< EntityKind > {
	return state.entities.config;
} //end getKindEntities()

export function getEntityRecord(
	state: State,
	kind: EntityKindName,
	key: EntityId
): Maybe< EntityInstance > {
	return get( state.entities.data, [ kind, key ] );
} //end getEntityRecord()
