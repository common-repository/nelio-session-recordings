/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';

/**
 * External dependencies
 */
import RcTooltip from 'rc-tooltip';
import type { TooltipProps as RcTooltipProps } from 'rc-tooltip/lib/Tooltip';

/**
 * Internal dependencies
 */
import './style.scss';

export type TooltipProps = {
	readonly delay?: RcTooltipProps[ 'mouseEnterDelay' ];
	readonly text?: RcTooltipProps[ 'overlay' ];
	readonly children: JSX.Element;
} & Pick< RcTooltipProps, 'getTooltipContainer' | 'placement' >;

export const Tooltip = ( {
	children,
	delay,
	placement = 'bottom',
	text,
	getTooltipContainer,
}: TooltipProps ): JSX.Element => {
	if ( ! text ) {
		return children;
	} //end if

	return (
		<RcTooltip
			overlayClassName="neliosr-tooltip"
			overlay={ text }
			destroyTooltipOnHide={ true }
			overlayStyle={ { maxWidth: '30em' } }
			placement={ placement }
			mouseEnterDelay={ delay }
			getTooltipContainer={ getTooltipContainer }
		>
			{ children }
		</RcTooltip>
	);
};
