import type { State } from './types';

export const STORE_NAME = 'neliosr/data';

export const INIT_STATE: State = {
	entities: {
		config: [],
		data: {},
	},

	experiments: {},

	page: {
		isLocked: false,
		'recording/isSidebarOpen': true,
	},

	recordings: {
		active: 0,
		items: [],
	},

	settings: {
		recordingStatus: false,
		today: '2013-01-01',
		plugins: [],
		nelio: {
			homeUrl: '',
			adminUrl: '/wp-admin/',
			siteId: '',
			capabilities: [],
		},
	},

	siteQuota: undefined,
};
