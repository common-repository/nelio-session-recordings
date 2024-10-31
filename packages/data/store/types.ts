/**
 * External dependencies
 */
import type {
	EntityId,
	EntityInstance,
	EntityKind,
	EntityKindName,
	Experiment,
	ExperimentId,
	Maybe,
	PluginSettings,
	Quota,
	SessionRecording,
	Uuid,
} from '@neliosr/types';
import type { eventWithTime as Event } from '@rrweb/types';
import type rrwebPlayer from 'rrweb-player';

export type State = {
	readonly entities: {
		readonly config: ReadonlyArray< EntityKind >;
		readonly data: Record<
			EntityKindName,
			Record< EntityId, EntityInstance >
		>;
	};

	readonly experiments: Record< ExperimentId, Experiment >;

	readonly page: PageAttributes;

	readonly recordings: {
		readonly items: ReadonlyArray< SessionRecording >;
		readonly active: number;
		readonly nextBatchKey?: { key: string } | 'done';
	};

	readonly settings: {
		readonly recordingStatus: boolean;
		readonly nelio: PluginSettings;
		readonly today: string;
		readonly plugins: ReadonlyArray< string >;
	};

	readonly siteQuota: Maybe< Quota >;
};

// ============
// HELPER TYPES
// ============

type StartTimestamp = number;
type EndTimestamp = number;

type PageAttributes = {
	readonly isLocked: boolean;

	readonly 'recording/activeId'?: Uuid;
	readonly 'recording/currentTime'?: number;
	readonly 'recording/events'?: ReadonlyArray< Event >;
	readonly 'recording/inactivePeriods'?: ReadonlyArray<
		[ StartTimestamp, EndTimestamp ]
	>;
	readonly 'recording/isSidebarOpen'?: boolean;
	readonly 'recording/player'?: rrwebPlayer;
	readonly 'recording/skipInactive'?: boolean;
	readonly 'recording/validEvents'?: ReadonlyArray< Event >;

	readonly 'recording/clickAudioFile'?: string;

	readonly 'welcome/isPluginBeingInitialized'?: boolean;
	readonly 'welcome/isPolicyAccepted'?: boolean;
	readonly 'welcome/license'?: string;
	readonly 'welcome/error'?: string;
};
