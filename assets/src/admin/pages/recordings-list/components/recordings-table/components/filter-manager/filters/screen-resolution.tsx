/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { addFilter } from '@safe-wordpress/hooks';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { NumberMatchControl } from '@neliosr/components';
import { doesNumberMatch } from '@neliosr/utils';
import type { SessionRecording } from '@neliosr/types';

/**
 * Internal dependencies
 */
import {
	ScreenResolutionFilter,
	FilterComponentProps,
	FilterDescriptionComponentProps,
} from '../../../../../types';

addFilter(
	'neliosr.get_default_screen-resolution_filter',
	'neliosr.get_default_screen-resolution_filter',
	(): ScreenResolutionFilter => ( {
		type: 'screen-resolution',
		width: {
			matchType: 'greater-than',
			matchValue: 0,
		},
		height: {
			matchType: 'greater-than',
			matchValue: 0,
		},
	} )
);

addFilter(
	'neliosr.get_screen-resolution_filter_overview_description',
	'neliosr.get_screen-resolution_filter_overview_description',
	() =>
		( {
			filter,
		}: FilterDescriptionComponentProps< ScreenResolutionFilter > ): JSX.Element => {
			let width = '';
			switch ( filter.width.matchType ) {
				case 'less-than':
					width =
						filter.width.matchType === filter.height.matchType
							? `${ filter.width.matchValue }`
							: sprintf(
									/* translators: number of pixels */
									_x(
										'[<%d]',
										'text',
										'nelio-session-recordings'
									),
									filter.width.matchValue
							  );
					break;

				case 'greater-than':
					width =
						filter.width.matchType === filter.height.matchType
							? `${ filter.width.matchValue }`
							: sprintf(
									/* translators: number of pixels */
									_x(
										'[>%d]',
										'text',
										'nelio-session-recordings'
									),
									filter.width.matchValue
							  );
					break;

				case 'between':
					width =
						filter.width.minMatchValue ===
						filter.width.maxMatchValue
							? `${ filter.width.minMatchValue }`
							: sprintf(
									/* translators: 1 -> number of pixels 2 -> number of pixels */
									_x(
										'[%1$d–%2$d]',
										'text',
										'nelio-session-recordings'
									),
									filter.width.minMatchValue,
									filter.width.maxMatchValue
							  );
					break;
			} //end switch

			let height = '';
			switch ( filter.height.matchType ) {
				case 'less-than':
					height =
						filter.width.matchType === filter.height.matchType
							? `${ filter.height.matchValue }`
							: sprintf(
									/* translators: number of pixels */
									_x(
										'[<%d]',
										'text',
										'nelio-session-recordings'
									),
									filter.height.matchValue
							  );
					break;

				case 'greater-than':
					height =
						filter.width.matchType === filter.height.matchType
							? `${ filter.height.matchValue }`
							: sprintf(
									/* translators: number of pixels */
									_x(
										'[>%d]',
										'text',
										'nelio-session-recordings'
									),
									filter.height.matchValue
							  );
					break;

				case 'between':
					height =
						filter.height.minMatchValue ===
						filter.height.maxMatchValue
							? `${ filter.height.minMatchValue }`
							: sprintf(
									/* translators: 1 -> number of pixels 2 -> number of pixels */
									_x(
										'[%1$d–%2$d]',
										'text',
										'nelio-session-recordings'
									),
									filter.height.minMatchValue,
									filter.height.maxMatchValue
							  );
					break;
			} //end switch

			if ( filter.width.matchType === filter.height.matchType ) {
				if ( filter.width.matchType === 'less-than' ) {
					return (
						<span>
							{ sprintf(
								/* translators: 1 -> width (number) 2 -> height (number) */
								_x(
									'< %1$sx%2$s px',
									'text',
									'nelio-session-recordings'
								),
								width,
								height
							) }
						</span>
					);
				} //end if

				if ( filter.width.matchType === 'greater-than' ) {
					return (
						<span>
							{ sprintf(
								/* translators: 1 -> width (number) 2 -> height (number) */
								_x(
									'> %1$sx%2$s px',
									'text',
									'nelio-session-recordings'
								),
								width,
								height
							) }
						</span>
					);
				} //end if
			} //end if

			return <span>{ `${ width }x${ height } px` }</span>;
		}
);

addFilter(
	'neliosr.apply_screen-resolution_filter',
	'neliosr.apply_screen-resolution_filter',
	(
		value: boolean,
		recording: SessionRecording,
		filter: ScreenResolutionFilter
	): boolean =>
		value &&
		doesNumberMatch( filter.width, recording.windowWidth ) &&
		doesNumberMatch( filter.height, recording.windowHeight )
);

const ScreenResolutionFilterControl = ( {
	filter,
	onChange,
}: FilterComponentProps< ScreenResolutionFilter > ): JSX.Element => (
	<>
		<p
			style={ {
				textTransform: 'uppercase',
				fontWeight: 'bold',
				marginTop: 0,
			} }
		>
			{ _x( 'Width', 'text', 'nelio-session-recordings' ) }
		</p>
		<NumberMatchControl
			match={ filter.width }
			label={ _x(
				'Width in pixels',
				'text',
				'nelio-session-recordings'
			) }
			labelMinimum={ _x(
				'Minimum width',
				'text',
				'nelio-session-recordings'
			) }
			labelMaximum={ _x(
				'Maximum width',
				'text',
				'nelio-session-recordings'
			) }
			onChange={ ( newMatch ) => {
				onChange( { ...filter, width: newMatch } );
			} }
		/>
		<p
			style={ {
				textTransform: 'uppercase',
				fontWeight: 'bold',
				marginTop: '2em',
			} }
		>
			{ _x( 'Height', 'text', 'nelio-session-recordings' ) }
		</p>
		<NumberMatchControl
			match={ filter.height }
			label={ _x(
				'Height in pixels',
				'text',
				'nelio-session-recordings'
			) }
			labelMinimum={ _x(
				'Minimum height',
				'text',
				'nelio-session-recordings'
			) }
			labelMaximum={ _x(
				'Maximum height',
				'text',
				'nelio-session-recordings'
			) }
			onChange={ ( newMatch ) => {
				onChange( { ...filter, height: newMatch } );
			} }
		/>
	</>
);

addFilter(
	'neliosr.get_screen-resolution_filter_component',
	'neliosr.get_screen-resolution_filter_component',
	() => ScreenResolutionFilterControl
);
