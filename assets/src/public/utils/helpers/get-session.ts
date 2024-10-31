/**
 * External dependencies
 */
import { v4 as uuid } from 'uuid';
import type { Maybe } from '@neliosr/types';

/**
 * Internal dependencies
 */
import { doesVisitorParticipate } from './internal/does-visitor-participate';
import { getSettings } from './internal/get-settings';
import { SESSION_MAX_TIME, SESSION_MAX_TIME_BETWEEN_EVENTS } from './constants';

import { getCookie, setCookie } from '../cookies';
import { clearEventsStore } from '../storage';
import type { Session, StoredSession } from '../../types';

// =======
// HELPERS
// =======

export const getSession = (): Maybe< Session > => {
	const settings = getSettings();
	if ( ! settings ) {
		// eslint-disable-next-line no-console
		console.error( '[NSR] Settings not found.' );
		return;
	} //end if

	if ( ! doesVisitorParticipate( settings ) ) {
		return;
	} //end if

	let value = getCookie( 'neliosrSession' );
	if ( ! value ) {
		clearEventsStore();
		const now = new Date().getTime();
		value = JSON.stringify( {
			id: uuid(),
			first: now,
			last: now,
		} );
		setCookie( 'neliosrSession', value, {
			expires: SESSION_MAX_TIME_BETWEEN_EVENTS,
		} );
	} //end if

	let session = JSON.parse( value ) as StoredSession;
	if ( new Date().getTime() - session.last > SESSION_MAX_TIME ) {
		clearEventsStore();
		const now = new Date().getTime();
		session = { id: uuid(), first: now, last: now };
		setCookie( 'neliosrSession', JSON.stringify( session ), {
			expires: SESSION_MAX_TIME_BETWEEN_EVENTS,
		} );
	} //end if

	return {
		...settings,
		id: session.id,
	};
};
