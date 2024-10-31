/**
 * Internal dependencies
 */
import type { Url } from './utils';

export type SiteId = string;

export type PluginSettings = {
	readonly homeUrl: Url;
	readonly adminUrl: Url;
	readonly capabilities: ReadonlyArray< NeliosrCapability >;
	readonly siteId: SiteId;
};

export type SamplingRateSettings =
	| { readonly mode: 'custom'; readonly percentage: number }
	| { readonly mode: 'unlimited' }
	| { readonly mode: 'uniform'; readonly estimatedSessions: number };

export type NeliosrCapability =
	| 'edit_neliosr_recordings'
	| 'delete_neliosr_recordings'
	| 'start_neliosr_recordings'
	| 'stop_neliosr_recordings'
	| 'read_neliosr_recordings'
	| 'manage_neliosr_options';
