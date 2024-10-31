/**
 * External dependencies
 */
import s from 'store';
import type { Maybe } from '@neliosr/types';

const store = s as Store;
type Store = {
	readonly set: < T >( key: string, value: StoreValue< T > ) => void;
	readonly get: < T >( key: string ) => Maybe< StoreValue< T > >;
	readonly remove: ( key: string ) => void;
	readonly each: ( fn: ( v: StoreValue, k: string ) => void ) => void;
};

type StoreValue< T = unknown > = {
	readonly value: T;
	readonly expiration?: number;
};

/**
 * Saves the given key/value pair in the browser’s store.
 *
 * @param {string} key      a key that identifies the value.
 * @param {any}    value    the specific value.
 * @param {number} lifespan Optional. The number of seconds the value should be valid.
 *                          If not set, the key/value pair never expires.
 */
export function setValue( key: string, value: unknown, lifespan = 0 ): void {
	const storeKey = getStoreKey( key );
	if ( lifespan ) {
		store.set( storeKey, {
			value,
			expiration: new Date().getTime() + lifespan * 1000,
		} );
	} else {
		store.set( storeKey, { value } );
	} //end if
} //end setValue()

/**
 * Returns the value of the given key if any. If it’s not set, it returns `default`.
 *
 * @param {string} key          the key that identifies the value we’re interested in.
 * @param {any}    defaultValue Optional. Default value.
 *
 * @return {any} the value of the given key in the store, if available and valid; `default`, if there’s no such value; `undefined` otherwise.
 */
export function getValue< T >( key: string, defaultValue?: T ): Maybe< T > {
	const storeKey = getStoreKey( key );
	const value = store.get< T >( storeKey );
	if ( ! value ) {
		return defaultValue;
	} //end if

	if ( value.expiration && value.expiration < new Date().getTime() ) {
		clearValue( key );
		return defaultValue;
	} //end if

	return value.value;
} //end getValue()

export function clearValue( key: string ): void {
	const storeKey = getStoreKey( key );
	store.remove( storeKey );
} //end clearValue()

function getStoreKey( key: string ): string {
	return `NelioSessionRecordings[${ key }]`;
} //end getStoreKey()

store.each( ( value: StoreValue, key: string ) => {
	if ( ! key.startsWith( 'NelioSessionRecordings' ) ) {
		return;
	} //end if

	if ( ! value || ! value.expiration ) {
		return;
	} //end if

	if ( value.expiration > new Date().getTime() ) {
		return;
	} //end if

	store.remove( key );
} );
