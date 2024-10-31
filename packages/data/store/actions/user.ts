/**
 * External dependencies
 */
import type { Quota } from '@neliosr/types';

export type SiteAction = ReceiveSiteQuota;

export function receiveSiteQuota( quota: Quota ): ReceiveSiteQuota {
	return {
		type: 'RECEIVE_SITE_QUOTA',
		quota,
	};
} //end ReceiveSiteQuota()

// ============
// HELPER TYPES
// ============

type ReceiveSiteQuota = {
	readonly type: 'RECEIVE_SITE_QUOTA';
	readonly quota: Quota;
};
