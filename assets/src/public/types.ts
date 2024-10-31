/**
 * External dependencies
 */
import type { SamplingRateSettings, SiteId, Url, Uuid } from '@neliosr/types';

// ========
// SETTINGS
// ========

export type Settings = {
	readonly api: ApiSettings;
	readonly isStagingSite: boolean;
	readonly site: SiteId;
	readonly trackShortSessions: boolean;
	readonly monthlyQuota: number;
	readonly samplingRate: SamplingRateSettings;
	readonly gdprCookie: GdprCookieSetting;
	readonly recordingsScope: ReadonlyArray< string >;
};

export type Session = Required< Settings > & {
	readonly id: Uuid;
};

export type StoredSession = {
	readonly id: Uuid;
	readonly first: number;
	readonly last: number;
	readonly isMeaningful?: boolean;
	readonly currentPage?: Url;
	readonly previousPage?: Url;
	readonly secondPreviousPage?: Url;
	readonly currentPageTimestamp?: number;
	readonly previousPageTimestamp?: number;
	readonly secondPreviousPageTimestamp?: number;
};

export type ParamValue = string | number | boolean;

type ApiSettings = {
	readonly mode: 'native';
	readonly url: Url;
};

export type GdprCookieSetting = {
	readonly name: string;
	readonly value: string;
};
