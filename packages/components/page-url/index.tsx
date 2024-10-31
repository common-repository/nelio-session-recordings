/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { ExternalLink } from '@safe-wordpress/components';

/**
 * External dependencies
 */
import { useHomeUrl } from '@neliosr/data';

/**
 * Internal dependencies
 */
import { Tooltip } from '../tooltip';
import './style.scss';

export const PageUrl = ( {
	url,
	isLink,
}: {
	readonly url: string;
	readonly isLink?: boolean;
} ): JSX.Element | null => {
	const homeUrl = useHomeUrl( '/', {} );

	if ( ! url ) {
		return null;
	} //end if

	const path = url.replace( homeUrl, homeUrl.endsWith( '/' ) ? '/' : '' );
	if ( isLink ) {
		return (
			<ExternalLink href={ url }>
				<Tooltip text={ url }>
					<span className="neliosr-ellipsis">{ path }</span>
				</Tooltip>
			</ExternalLink>
		);
	} //end if
	return (
		<Tooltip text={ url }>
			<div className="neliosr-ellipsis">{ path }</div>
		</Tooltip>
	);
};
