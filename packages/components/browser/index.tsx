/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';

/**
 * Internal dependencies
 */
import { Icon } from '../icon';

export const Browser = ( {
	type,
	showTooltip = true,
}: {
	readonly type: string;
	readonly showTooltip?: boolean;
} ): JSX.Element => {
	if ( type.includes( 'Chrome' ) || type.includes( 'Chromium' ) ) {
		return (
			<Icon
				icon="googleChrome"
				tooltip={ showTooltip ? type : undefined }
			/>
		);
	} //end if

	if ( type.includes( 'Android Browser' ) ) {
		return (
			<Icon icon="android" tooltip={ showTooltip ? type : undefined } />
		);
	} //end if

	if ( type.includes( 'Edge' ) ) {
		return (
			<Icon
				icon="microsoftEdge"
				tooltip={ showTooltip ? type : undefined }
			/>
		);
	} //end if

	if ( type.includes( 'Firefox' ) ) {
		return (
			<Icon icon="firefox" tooltip={ showTooltip ? type : undefined } />
		);
	} //end if

	if ( type.includes( 'Opera' ) ) {
		return <Icon icon="opera" tooltip={ showTooltip ? type : undefined } />;
	} //end if

	if ( type.includes( 'Safari' ) ) {
		return (
			<Icon icon="safari" tooltip={ showTooltip ? type : undefined } />
		);
	} //end if

	if ( type.startsWith( 'IE' ) ) {
		return (
			<Icon
				icon="internetExplorer"
				tooltip={ showTooltip ? type : undefined }
			/>
		);
	} //end if

	return <Icon icon="web" tooltip={ showTooltip ? type : undefined } />;
};
