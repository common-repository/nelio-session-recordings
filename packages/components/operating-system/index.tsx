/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';

/**
 * Internal dependencies
 */
import { Icon } from '../icon';

export const OperatingSystem = ( {
	type,
	showTooltip = true,
}: {
	readonly type: string;
	readonly showTooltip?: boolean;
} ): JSX.Element => {
	if ( type.startsWith( 'Windows' ) ) {
		return (
			<Icon icon="windows" tooltip={ showTooltip ? type : undefined } />
		);
	} //end if

	if ( type.startsWith( 'Mac OS' ) ) {
		return <Icon icon="apple" tooltip={ showTooltip ? type : undefined } />;
	} //end if

	if ( type.startsWith( 'iOS' ) ) {
		return (
			<Icon icon="appleIOS" tooltip={ showTooltip ? type : undefined } />
		);
	} //end if

	if ( type.startsWith( 'Android' ) ) {
		return (
			<Icon icon="android" tooltip={ showTooltip ? type : undefined } />
		);
	} //end if

	if ( type.startsWith( 'Chromium OS' ) ) {
		return (
			<Icon
				icon="googleChrome"
				tooltip={ showTooltip ? type : undefined }
			/>
		);
	} //end if

	if ( type.startsWith( 'Ubuntu' ) ) {
		return (
			<Icon icon="ubuntu" tooltip={ showTooltip ? type : undefined } />
		);
	} //end if

	if (
		type.startsWith( 'Linux' ) ||
		type.startsWith( 'RedHat' ) ||
		type.startsWith( 'SUSE' ) ||
		type.startsWith( 'Fedora' )
	) {
		return <Icon icon="linux" tooltip={ showTooltip ? type : undefined } />;
	} //end if

	return <Icon icon="web" tooltip={ showTooltip ? type : undefined } />;
};
