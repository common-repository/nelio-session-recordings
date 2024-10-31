/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Dashicon } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';
import {
	fullscreen,
	mapMarker,
	page,
	pages,
	postDate,
} from '@safe-wordpress/icons';

/**
 * External dependencies
 */
import { Icon } from '@neliosr/components';

const FILTER_CATEGORIES = [
	{
		category: _x( 'Session', 'text', 'nelio-session-recordings' ),
		filters: [
			{
				type: 'date',
				icon: postDate,
				label: _x( 'Date', 'text', 'nelio-session-recordings' ),
			},
			{
				type: 'country',
				icon: mapMarker,
				label: _x( 'Country', 'text', 'nelio-session-recordings' ),
			},
			{
				type: 'duration',
				icon: <Dashicon icon="clock" />,
				label: _x( 'Duration', 'text', 'nelio-session-recordings' ),
			},
			{
				type: 'page-count',
				icon: pages,
				label: _x( 'Page count', 'text', 'nelio-session-recordings' ),
			},
		],
	},
	{
		category: _x( 'Navigation', 'text', 'nelio-session-recordings' ),
		filters: [
			{
				type: 'landing-page',
				icon: <Icon icon="landing" />,
				label: _x( 'Landing page', 'text', 'nelio-session-recordings' ),
			},
			{
				type: 'exit-page',
				icon: <Icon icon="exit" />,
				label: _x( 'Exit page', 'text', 'nelio-session-recordings' ),
			},
			{
				type: 'viewed-page',
				icon: page,
				label: _x( 'Viewed page', 'text', 'nelio-session-recordings' ),
			},
		],
	},
	{
		category: _x( 'Behavior', 'text', 'nelio-session-recordings' ),
		filters: [
			{
				type: 'clicked-element',
				icon: <Icon icon="mouseClick" />,
				label: _x(
					'Clicked element',
					'text',
					'nelio-session-recordings'
				),
			},
			{
				type: 'rage-click',
				icon: <Icon icon="rage" />,
				label: _x( 'Rage click', 'text', 'nelio-session-recordings' ),
			},
			{
				type: 'dead-click',
				icon: <Icon icon="dead" />,
				label: _x( 'Dead click', 'text', 'nelio-session-recordings' ),
			},
			{
				type: 'refreshed-page',
				icon: <Icon icon="refresh" />,
				label: _x(
					'Refreshed page',
					'text',
					'nelio-session-recordings'
				),
			},
			{
				type: 'u-turn',
				icon: <Icon icon="arrowULeft" />,
				label: _x( 'U-turn', 'text', 'nelio-session-recordings' ),
			},
			{
				type: 'ab-testing',
				icon: <Icon icon="nabLogo" />,
				label: _x( 'A/B Testing', 'text', 'nelio-session-recordings' ),
			},
		],
	},
	{
		category: _x( 'Technology', 'text', 'nelio-session-recordings' ),
		filters: [
			{
				type: 'device',
				icon: <Icon icon="monitorCellphone" />,
				label: _x( 'Device', 'text', 'nelio-session-recordings' ),
			},
			{
				type: 'browser',
				icon: <Icon icon="web" />,
				label: _x( 'Browser', 'text', 'nelio-session-recordings' ),
			},
			{
				type: 'os',
				icon: (
					<span>
						{ _x( 'OS', 'text', 'nelio-session-recordings' ) }
					</span>
				),
				label: _x(
					'Operating system',
					'text',
					'nelio-session-recordings'
				),
			},
			{
				type: 'screen-resolution',
				icon: fullscreen,
				label: _x(
					'Screen resolution',
					'text',
					'nelio-session-recordings'
				),
			},
		],
	},
];

export default FILTER_CATEGORIES;
