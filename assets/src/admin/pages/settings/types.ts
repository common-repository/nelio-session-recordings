import { SamplingRateSettings } from '@neliosr/types';

export type Settings = {
	readonly isNabActive: boolean;
	readonly hideTitle: boolean;
	readonly trackShortSessions: boolean;
	readonly samplingRate: SamplingRateSettings;
	readonly gdprCookie?: {
		readonly customize: boolean;
		readonly name: string;
		readonly value: string;
	};
	readonly recordingsScope: ReadonlyArray< string >;
};
