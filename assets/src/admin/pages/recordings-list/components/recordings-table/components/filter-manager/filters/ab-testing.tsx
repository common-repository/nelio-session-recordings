/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { BaseControl, CheckboxControl } from '@safe-wordpress/components';
import { useSelect } from '@safe-wordpress/data';
import { addFilter } from '@safe-wordpress/hooks';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { isEmpty, trim } from 'lodash';
import { PostSearcher } from '@neliosr/components';
import { STORE_NAME as NSR_DATA } from '@neliosr/data';
import { getLetter } from '@neliosr/utils';
import type { Maybe, SessionRecording } from '@neliosr/types';

/**
 * Internal dependencies
 */
import {
	ABTestingFilter,
	FilterComponentProps,
	FilterDescriptionComponentProps,
	Settings,
} from '../../../../../types';

addFilter(
	'neliosr.get_default_ab-testing_filter',
	'neliosr.get_default_ab-testing_filter',
	(): ABTestingFilter => ( {
		type: 'ab-testing',
		test: undefined,
		variants: [],
		convertedGoals: [],
	} )
);

const ABTestingDescription = ( {
	filter,
}: FilterDescriptionComponentProps< ABTestingFilter > ): JSX.Element => {
	const test = useTest( filter.test );

	if ( ! filter.test ) {
		return (
			<span>
				{ _x( 'All recordings', 'text', 'nelio-session-recordings' ) }
			</span>
		);
	} //end if

	if ( ! test || ! test.name.length ) {
		return (
			<span>
				{ _x(
					'Participates in a test',
					'text',
					'nelio-session-recordings'
				) }
			</span>
		);
	} //end if

	return (
		<span>
			{ sprintf(
				/* translators: name of an A/B test */
				_x(
					'Participates in “%s”',
					'text',
					'nelio-session-recordings'
				),
				test.name
			) }
		</span>
	);
};

addFilter(
	'neliosr.get_ab-testing_filter_overview_description',
	'neliosr.get_ab-testing_filter_overview_description',
	() => ABTestingDescription
);

addFilter(
	'neliosr.apply_ab-testing_filter',
	'neliosr.apply_ab-testing_filter',
	(
		value: boolean,
		recording: SessionRecording,
		filter: ABTestingFilter,
		settings: Settings
	): boolean => {
		if ( settings.isStandalone ) {
			return value;
		} //end if

		if ( ! filter.test ) {
			return value;
		} //end if

		const recordingTestData = ( recording.tests || {} )[ filter.test ];
		if ( ! recordingTestData ) {
			return false;
		} //end if

		const doesVariantMatch = filter.variants.length
			? filter.variants.includes( recordingTestData.alt )
			: true;

		const doesConversionGoalMatch = filter.convertedGoals.length
			? filter.convertedGoals.some(
					( g ) => recordingTestData.goals?.includes( g )
			  )
			: true;

		return value && doesVariantMatch && doesConversionGoalMatch;
	}
);

const ABTestingFilterControl = ( {
	settings,
	filter,
	onChange,
}: FilterComponentProps< ABTestingFilter > ): JSX.Element => {
	const test = useTest( filter.test );

	return (
		<>
			{ settings.isStandalone && (
				<p>
					{ _x(
						'Activate Nelio A/B Testing to use this filter.',
						'user',
						'nelio-session-recordings'
					) }
				</p>
			) }
			<BaseControl
				id="neliosr_post_searcher"
				label={ _x( 'A/B Test', 'text', 'nelio-session-recordings' ) }
			>
				<PostSearcher
					id="neliosr_post_searcher"
					disabled={ settings.isStandalone }
					type={ 'nab_experiment' }
					value={ filter.test }
					filter={ ( t ) => t.type !== 'nab/heatmap' }
					perPage={ 10 }
					onChange={ ( value ) =>
						onChange( { ...filter, test: `${ value }` } )
					}
				/>
			</BaseControl>
			{ !! test && test.alternatives.length && (
				<BaseControl
					id="neliosr-variants-list"
					label={ _x(
						'Variant seen by visitor',
						'text',
						'nelio-session-recordings'
					) }
				>
					<div className="neliosr-variants-list">
						{ test.alternatives.map( ( alt, idx ) => (
							<CheckboxControl
								key={ idx }
								className="neliosr-variants-list__item"
								label={
									<p className="neliosr-variants-list__item-label">
										<span className="neliosr-alternative__letter">
											{ getLetter( idx ) }
										</span>
										{ getAlternativeName(
											idx,
											alt.attributes.name
										) }
									</p>
								}
								checked={ filter.variants.includes( idx ) }
								onChange={ ( isChecked ) =>
									onChange( {
										...filter,
										variants: [
											...filter.variants.filter(
												( v ) => v !== idx
											),
											...( isChecked ? [ idx ] : [] ),
										],
									} )
								}
							/>
						) ) }
					</div>
				</BaseControl>
			) }
			{ !! test && test.goals.length && (
				<BaseControl
					id="neliosr-goals-list"
					label={ _x(
						'Goal fullfilled by visitor (conversion)',
						'text',
						'nelio-session-recordings'
					) }
				>
					<div className="neliosr-goals-list">
						{ test.goals.map( ( goal, idx ) => (
							<CheckboxControl
								key={ idx }
								className="neliosr-goals-list__item"
								label={
									<p className="neliosr-variants-list__item-label">
										{ trim( goal.attributes.name ) ||
											getDefaulGoalNameForIndex( idx ) }
									</p>
								}
								checked={ filter.convertedGoals.includes(
									idx
								) }
								onChange={ ( isChecked ) =>
									onChange( {
										...filter,
										convertedGoals: [
											...filter.convertedGoals.filter(
												( g ) => g !== idx
											),
											...( isChecked ? [ idx ] : [] ),
										],
									} )
								}
							/>
						) ) }
					</div>
				</BaseControl>
			) }
		</>
	);
};

addFilter(
	'neliosr.get_ab-testing_filter_component',
	'neliosr.get_ab-testing_filter_component',
	() => ABTestingFilterControl
);

// =====
// HOOKS
// =====

const useTest = ( id: Maybe< string > ) =>
	useSelect( ( select ) => select( NSR_DATA ).getExperiment( id || '0' ) );

// =======
// HELPERS
// =======

export function getAlternativeName( index: number, name = '' ): string {
	name = trim( name );
	if ( ! isEmpty( name ) ) {
		return name;
	} //end if

	if ( 0 === index ) {
		return _x( 'Control Version', 'text', 'nelio-session-recordings' );
	} //end if

	return sprintf(
		/* translators: a letter, such as A, B, or C */
		_x( 'Variant %s', 'text', 'nelio-session-recordings' ),
		getLetter( index )
	);
} //end getAlternativeName()

const getDefaulGoalNameForIndex = ( index: number ) =>
	index
		? sprintf(
				/* translators: a number */
				_x( 'Goal %d', 'text', 'nelio-session-recordings' ),
				index + 1
		  )
		: _x( 'Default Goal', 'text', 'nelio-session-recordings' );
