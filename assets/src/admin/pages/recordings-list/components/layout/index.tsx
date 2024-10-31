/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';

/**
 * Internal dependencies
 */
import './style.scss';
import { PageTitle } from '../page-title';
import { RecordingsTable } from '../recordings-table';
import { SubscriptionControl } from '../subscription-control';
import type { Settings } from '../../types';

type LayoutProps = {
	readonly settings: Settings;
};
export const Layout = ( { settings }: LayoutProps ): JSX.Element => {
	return (
		<div className="nelio-session-recordings-wrapper">
			<div className="nelio-session-recordings-wrapper__header">
				<PageTitle settings={ settings } />
				<SubscriptionControl settings={ settings } />
			</div>
			<div className="nelio-session-recordings-container">
				<RecordingsTable settings={ settings } />
			</div>
		</div>
	);
};
