/**
 * WordPress dependencies
 */
import apiFetch from '@safe-wordpress/api-fetch';
import { dispatch, resolveSelect } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { find, values } from 'lodash';
import type {
	EntityKind,
	EntityKindName,
	EntityId,
	EntityInstance,
} from '@neliosr/types';

/**
 * Internal dependencies
 */
import { STORE_NAME as NSR_DATA } from '../../config';

export async function getKindEntities(): Promise< void > {
	try {
		const response = await apiFetch< Record< EntityKindName, EntityKind > >(
			{ path: '/neliosr/v1/types' }
		);
		dispatch( NSR_DATA ).receiveKindEntitiesQuery( values( response ) );
	} catch ( e ) {
		// eslint-disable-next-line
		console.warn( e );
	} //end try
} //end getKindEntities()

export async function getEntityRecord(
	kind?: EntityKindName,
	key?: EntityId
): Promise< void > {
	if ( ! kind || ! key ) {
		return;
	} //end if

	try {
		const entities = await resolveSelect( NSR_DATA ).getKindEntities();
		const entity = find( entities, { name: kind } );
		if ( ! entity ) {
			// eslint-disable-next-line
			console.warn( `Entity ${ kind } not found in`, entities );
			return;
		} //end if

		const record = await apiFetch< EntityInstance >( {
			path: `/neliosr/v1/post/?id=${ key }&type=${ kind }`,
		} );
		dispatch( NSR_DATA ).receiveEntityRecords( kind, record );
	} catch ( e ) {
		// eslint-disable-next-line
		console.warn( e );
	} //end try
} //end getEntityRecord()
