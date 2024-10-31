/**
 * WordPress dependencies
 */
import { addQueryArgs } from '@safe-wordpress/url';

export function addFreeTracker( link: string ): string {
	return addQueryArgs( link, {
		utm_source: 'nelio-session-recordings',
		utm_medium: 'plugin',
		utm_campaign: 'free',
	} );
} //end addFreeTracker()
