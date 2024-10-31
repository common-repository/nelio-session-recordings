/**
 * External dependencies
 */
import { get } from 'lodash';
import type { Experiment, ExperimentId, Maybe } from '@neliosr/types';

/**
 * Internal dependencies
 */
import { State } from '../types';

export function getExperiment(
	state: State,
	key: ExperimentId
): Maybe< Experiment > {
	return get( state.experiments, key );
} //end getExperiment()

export type GetExperimentAttributeFunction = < K extends keyof Experiment >(
	key: ExperimentId,
	attribute: K
) => Maybe< Experiment[ K ] >;

export function getExperimentAttribute< K extends keyof Experiment >(
	state: State,
	key: ExperimentId,
	attribute: K
): Maybe< Experiment[ K ] > {
	const experiment = getExperiment( state, key );
	if ( ! experiment ) {
		return;
	} //end if
	return experiment[ attribute ];
} //end getExperimentAttribute()
