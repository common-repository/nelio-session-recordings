/**
 * Internal dependencies
 */
import { Datetime } from './datetime';
import { ExperimentId } from './experiments';
import { Url, Uuid } from './utils';

export type SessionRecording = {
	readonly site: Uuid;
	readonly id: Uuid;
	readonly status: 'active' | 'completed';
	readonly ttl: number;

	readonly first: Datetime;
	readonly last: Datetime;
	readonly duration: number; // in seconds

	readonly country: string;
	readonly browser: string;
	readonly os: string;

	readonly device: string;
	readonly windowWidth?: number;
	readonly windowHeight?: number;

	readonly numberOfActions: number;
	readonly numberOfClicks: number;

	readonly pages: ReadonlyArray< Url >;
	readonly landing?: Url;
	readonly exit?: Url;

	readonly refreshedPages?: ReadonlyArray< Url >;
	readonly uTurnPages?: ReadonlyArray< Url >;

	readonly isReturningVisitor?: boolean;
	readonly isExample?: boolean;

	readonly clicks?: ReadonlyArray< ClickData >;
	readonly tests?: Record< ExperimentId, ExperimentSummary >;

	readonly events?: Url;
};

type ClickData = {
	readonly selector: string;
	readonly isClickable: boolean;
	readonly isRageClick?: boolean;
	readonly id?: string;
	readonly text?: string;
};

type ExperimentSummary = {
	readonly alt: number;
	readonly goals?: ReadonlyArray< number >; // goals with conversions
};

export type NabEventPayload = NabVisit | NabConversion;

type NabVisit = {
	readonly kind: 'visit';
	readonly experiment: ExperimentId;
	readonly alternative: number;
};

type NabConversion = {
	readonly kind: 'conversion';
	readonly experiment: ExperimentId;
	readonly alternative: number;
	readonly goal: number;
};
