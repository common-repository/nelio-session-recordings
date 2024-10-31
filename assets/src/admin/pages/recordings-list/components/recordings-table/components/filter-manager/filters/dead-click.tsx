/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { addFilter } from '@safe-wordpress/hooks';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import type { SessionRecording } from '@neliosr/types';

/**
 * Internal dependencies
 */
import { DeadClickFilter } from '../../../../../types';

addFilter(
	'neliosr.get_default_dead-click_filter',
	'neliosr.get_default_dead-click_filter',
	(): DeadClickFilter => ( {
		type: 'dead-click',
	} )
);

addFilter(
	'neliosr.get_dead-click_filter_overview_description',
	'neliosr.get_dead-click_filter_overview_description',
	() => (): JSX.Element => {
		return (
			<span>
				{ _x( 'Has dead clicks', 'text', 'nelio-session-recordings' ) }
			</span>
		);
	}
);

addFilter(
	'neliosr.apply_dead-click_filter',
	'neliosr.apply_dead-click_filter',
	( value: boolean, recording: SessionRecording ): boolean =>
		value && ( recording.clicks || [] ).some( ( c ) => ! c.isClickable )
);

const DeadClickFilterControl = (): JSX.Element => (
	<>
		<p>
			{ _x(
				'Dead clicks are when users click on an element that is not clickable.',
				'text',
				'nelio-session-recordings'
			) }
		</p>
	</>
);

addFilter(
	'neliosr.get_dead-click_filter_component',
	'neliosr.get_dead-click_filter_component',
	() => DeadClickFilterControl
);
