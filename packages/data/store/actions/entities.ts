/**
 * External dependencies
 */
import { castArray } from 'lodash';
import type {
	EntityInstance,
	EntityKind,
	EntityKindName,
} from '@neliosr/types';

export type EntityAction = ReceiveKindEntitiesQuery | ReceiveEntityRecords;

export function receiveKindEntitiesQuery(
	kindEntities: EntityKind | ReadonlyArray< EntityKind >
): ReceiveKindEntitiesQuery {
	return {
		type: 'RECEIVE_TYPE_QUERY',
		kindEntities: castArray( kindEntities ),
	};
} //end receiveKindEntitiesQuery()

export function receiveEntityRecords(
	kind: EntityKindName,
	records: EntityInstance | ReadonlyArray< EntityInstance >
): ReceiveEntityRecords {
	return {
		type: 'RECEIVE_ITEMS',
		items: castArray( records ),
		kind,
	};
} //end receiveEntityRecords()

// ============
// HELPER TYPES
// ============

type ReceiveKindEntitiesQuery = {
	readonly type: 'RECEIVE_TYPE_QUERY';
	readonly kindEntities: ReadonlyArray< EntityKind >;
};

type ReceiveEntityRecords = {
	readonly type: 'RECEIVE_ITEMS';
	readonly kind: EntityKindName;
	readonly items: ReadonlyArray< EntityInstance >;
};
