/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import { Icon } from '../icon';

export const Device = ( {
	type,
	showTooltip = true,
}: {
	readonly type: string;
	readonly showTooltip?: boolean;
} ): JSX.Element => {
	// console, mobile, tablet, smarttv, wearable, embedded, desktop
	switch ( type ) {
		case 'mobile':
			return (
				<Icon
					icon="cellphone"
					tooltip={
						showTooltip
							? _x( 'Mobile', 'text', 'nelio-session-recordings' )
							: undefined
					}
				/>
			);
		case 'tablet':
			return (
				<Icon
					icon="tablet"
					tooltip={
						showTooltip
							? _x( 'Tablet', 'text', 'nelio-session-recordings' )
							: undefined
					}
				/>
			);
		default:
			return (
				<Icon
					icon="monitor"
					tooltip={
						showTooltip
							? _x(
									'Desktop',
									'text',
									'nelio-session-recordings'
							  )
							: undefined
					}
				/>
			);
	}
};
