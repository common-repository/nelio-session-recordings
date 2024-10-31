/**
 * Internal dependencies
 */
import type { Maybe } from '@neliosr/types';

/**
 * Internal dependencies
 */
import type { Settings } from '../../../types';

export const getSettings = (): Maybe< Required< Settings > > => {
	const win = window as unknown;
	if ( ! hasSettings( win ) ) {
		return;
	} //end if

	const settings = win.neliosrSettings;
	return {
		api: { mode: 'native', url: '' },
		isStagingSite: false,
		monthlyQuota: 0,
		site: '',
		trackShortSessions: false,
		recordingsScope: [],
		samplingRate: { mode: 'unlimited' },
		gdprCookie: { name: '', value: '' },
		...settings,
	};
};

// ========
// INTERNAL
// ========

const hasSettings = (
	win: unknown
): win is { neliosrSettings: Partial< Settings > } =>
	!! win && 'object' === typeof win && 'neliosrSettings' in win;
