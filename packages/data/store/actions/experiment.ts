/**
 * External dependencies
 */
import { castArray } from 'lodash';
import type { Experiment } from '@neliosr/types';

export type ExperimentAction = ReceiveExperiments;

export function receiveExperiments(
	experiments: Experiment | ReadonlyArray< Experiment >
): ReceiveExperiments {
	return {
		type: 'RECEIVE_EXPERIMENTS',
		experiments: castArray( experiments ),
	};
} //end receiveExperiments()

// ============
// HELPER TYPES
// ============

type ReceiveExperiments = {
	readonly type: 'RECEIVE_EXPERIMENTS';
	readonly experiments: ReadonlyArray< Experiment >;
};
