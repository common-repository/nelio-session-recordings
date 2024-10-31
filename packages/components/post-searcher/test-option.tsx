/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import type { OptionProps } from 'react-select';
import { STORE_NAME as NSR_DATA } from '@neliosr/data';
import type { Experiment } from '@neliosr/types';

const NAB_EXPERIMENTS = 'nab/experiments';

export type TestData = {
	readonly type: string;
	readonly value: number;
	readonly label: string;
};

export const TestOption = ( {
	data: { type, value },
	isFocused,
	isSelected,
	innerRef,
	innerProps,
}: OptionProps< TestData > ): JSX.Element => {
	const post = usePost( type, value ) as Experiment | undefined;
	const { name, type: testType, status } = post || {};
	const experimentType = useExperimentType( testType ?? '' );
	const Icon = experimentType?.icon ?? ( () => <></> );

	return (
		<div
			ref={ innerRef }
			className={ classnames( {
				'neliosr-test-option-in-post-searcher': true,
				'neliosr-test-option-in-post-searcher--is-focused': isFocused,
				'neliosr-test-option-in-post-searcher--is-selected': isSelected,
			} ) }
			{ ...innerProps }
		>
			<div className="neliosr-test-option-in-post-searcher__image">
				<Icon />
			</div>
			<div className="neliosr-test-option-in-post-searcher__title">
				{ name }
			</div>

			<div className="neliosr-test-option-in-post-searcher__details">
				{ `${ experimentType?.title ?? '' } • ${ getStatusLabel(
					status ?? 'draft'
				) }` }
			</div>
		</div>
	);
};

// =====
// HOOKS
// =====

const usePost = ( type: string, id: number ) =>
	useSelect( ( select ) =>
		type === 'nab_experiment'
			? select( NSR_DATA ).getExperiment( `${ id }` || '0' )
			: select( NSR_DATA ).getEntityRecord( type, id )
	);

const useExperimentType = ( type: string ) =>
	useSelect(
		( select ) => select( NAB_EXPERIMENTS )?.getExperimentType( type )
	);

// =======
// HELPERS
// =======

function getStatusLabel( status: Experiment[ 'status' ] ): string {
	switch ( status ) {
		case 'paused':
			return _x(
				'Paused',
				'text (experiment status)',
				'nelio-ab-testing'
			);

		case 'finished':
			return _x(
				'Finished',
				'text (experiment status)',
				'nelio-ab-testing'
			);

		default:
			return _x(
				'Running',
				'text (experiment status)',
				'nelio-ab-testing'
			);
	} //end switch
} //end getStatusLabel()
