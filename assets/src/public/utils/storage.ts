/**
 * External dependencies
 */
import type { eventWithTime } from '@rrweb/types';

const DB_NAME = 'neliosr-events';
const DB_VERSION = 1;
const DB_STORE_NAME = 'events';

let db: IDBDatabase;

export const initEventsStore = ( callback: () => void ): void => {
	const req = indexedDB.open( DB_NAME, DB_VERSION );
	req.onsuccess = function () {
		db = this.result;
		callback();
	};
	req.onerror = function ( event ) {
		// eslint-disable-next-line no-console
		console.error(
			'initEventsStore:',
			( event.target as unknown as { errorCode: unknown } ).errorCode
		);
	};

	req.onupgradeneeded = function ( event: IDBVersionChangeEvent ) {
		const result = (
			event.currentTarget as unknown as { result: IDBDatabase }
		 ).result;
		result.createObjectStore( DB_STORE_NAME, {
			keyPath: 'id',
			autoIncrement: true,
		} );
	};
};

function getObjectStore( storeName: string, mode: IDBTransactionMode ) {
	const tx = db.transaction( storeName, mode );
	return tx.objectStore( storeName );
} //end getObjectStore()

export const clearEventsStore = (): void => {
	const store = getObjectStore( DB_STORE_NAME, 'readwrite' );
	const req = store.clear();
	req.onerror = function ( event ) {
		// eslint-disable-next-line no-console
		console.error(
			'clearObjectStore:',
			( event.target as unknown as { errorCode: unknown } ).errorCode
		);
	};
}; //end clearEventsStore()

export const saveEvent = ( event: eventWithTime ): void => {
	const store = getObjectStore( DB_STORE_NAME, 'readwrite' );
	const req = store.add( event );
	req.onerror = function () {
		// eslint-disable-next-line no-console
		console.error( 'saveEvent error', this.error );
	};
};

export const extractEvents = (
	callback: ( events: ReadonlyArray< eventWithTime > ) => void
): void => {
	const events: eventWithTime[] = [];
	const store = getObjectStore( DB_STORE_NAME, 'readwrite' );
	const req = store.openCursor();
	req.onsuccess = ( event ) => {
		const cursor = (
			event.target as unknown as {
				result: IDBCursor;
			}
		 ).result;
		if ( cursor ) {
			events.push(
				( cursor as unknown as { value: eventWithTime } ).value
			);
			cursor.delete();
			cursor.continue();
		} else {
			callback( events );
		} //end if
	};
	req.onerror = function () {
		// eslint-disable-next-line no-console
		console.error( 'getEvents error', this.error );
	};
};
