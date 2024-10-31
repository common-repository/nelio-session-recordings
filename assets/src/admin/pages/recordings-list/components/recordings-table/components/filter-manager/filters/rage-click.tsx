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
import { RageClickFilter } from '../../../../../types';

addFilter(
	'neliosr.get_default_rage-click_filter',
	'neliosr.get_default_rage-click_filter',
	(): RageClickFilter => ( {
		type: 'rage-click',
	} )
);

addFilter(
	'neliosr.get_rage-click_filter_overview_description',
	'neliosr.get_rage-click_filter_overview_description',
	() => (): JSX.Element => {
		return (
			<span>
				{ _x( 'Has rage clicks', 'text', 'nelio-session-recordings' ) }
			</span>
		);
	}
);

addFilter(
	'neliosr.apply_rage-click_filter',
	'neliosr.apply_rage-click_filter',
	( value: boolean, recording: SessionRecording ): boolean =>
		value && ( recording.clicks || [] ).some( ( c ) => !! c.isRageClick )
);

const RageClickFilterControl = (): JSX.Element => (
	<>
		<p>
			{ _x(
				'Rage clicks are when users repeatedly click on an element, indicating frustration.',
				'text',
				'nelio-session-recordings'
			) }
		</p>
	</>
);

addFilter(
	'neliosr.get_rage-click_filter_component',
	'neliosr.get_rage-click_filter_component',
	() => RageClickFilterControl
);
