/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect } from '@safe-wordpress/data';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { isEmpty, trim } from 'lodash';
import { STORE_NAME as NSR_DATA } from '@neliosr/data';
import { getLetter } from '@neliosr/utils';
import { Maybe, NabEventPayload } from '@neliosr/types';

const NAB_EXPERIMENTS = 'nab/experiments';

export const NabEvent = ( {
	event,
}: {
	event: NabEventPayload;
} ): JSX.Element => {
	const { kind, experiment, alternative } = event;
	const test = useTest( experiment );
	const experimentType = useExperimentType( test?.type ?? '' );
	const TestIcon = experimentType?.icon ?? ( () => <></> );

	const label =
		kind === 'visit'
			? _x( 'Visit', 'text', 'nelio-session-recordings' )
			: _x( 'Conversion', 'text', 'nelio-session-recordings' );

	const goal = kind === 'conversion' ? test?.goals[ event.goal ] : undefined;

	return (
		<>
			<div className="nab-event-kind">{ label }</div>
			<div className="nab-event-label">
				{ _x( 'Test', 'text', 'nelio-session-recordings' ) }
			</div>
			<div className="nab-event-test">
				<div className="nab-event-test-icon">
					<TestIcon />
				</div>
				<div className="nab-event-test-name">{ test?.name }</div>
			</div>
			<div className="nab-event-label">
				{ _x( 'Variant', 'text', 'nelio-session-recordings' ) }
			</div>
			<div className="nab-event-variant">
				<span
					className={ `nab-event-variant__letter nab-event-variant__letter-${ alternative }` }
				>
					{ getLetter( alternative ) }
				</span>
				<div className="nab-event-variant-name">
					{ getAlternativeName(
						alternative,
						test?.alternatives[ alternative ]?.attributes.name
					) }
				</div>
			</div>
			{ kind === 'conversion' && !! goal && (
				<>
					<div className="nab-event-label">
						{ _x( 'Goal', 'text', 'nelio-session-recordings' ) }
					</div>
					<div className="nab-event-conversion-goal">
						<span className="dashicons dashicons-flag"></span>
						<div className="nab-event-conversion-goal-name">
							{ trim( goal.attributes.name ) ||
								getDefaulGoalNameForIndex( event.goal ) }
						</div>
					</div>
				</>
			) }
		</>
	);
};

// =====
// HOOKS
// =====

const useTest = ( id: Maybe< string > ) =>
	useSelect( ( select ) => select( NSR_DATA ).getExperiment( id || '0' ) );

const useExperimentType = ( type: string ) =>
	useSelect(
		( select ) => select( NAB_EXPERIMENTS )?.getExperimentType( type )
	);

// =======
// HELPERS
// =======

function getAlternativeName( index: number, name = '' ): string {
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
