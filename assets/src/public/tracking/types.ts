/**
 * External dependencies
 */
import type { ExperimentId } from '@neliosr/types';

export type NabTrackEvent = VisitEvent | ConversionEvent;

type VisitEvent = {
	readonly kind: 'visit';
	readonly type: 'regular' | 'global' | 'woocommerce';
	readonly experiment: ExperimentId;
	readonly alternative: number;
	readonly segments: ReadonlyArray< number >;
};

type ConversionEvent = {
	readonly kind: 'conversion';
	readonly experiment: ExperimentId;
	readonly alternative: number;
	readonly goal: number;
	readonly segments: ReadonlyArray< number >;
};
