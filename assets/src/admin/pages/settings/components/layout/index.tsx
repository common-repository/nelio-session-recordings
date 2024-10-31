/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { NoticeList } from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { store as noticesStore } from '@safe-wordpress/notices';

const NOTICES = noticesStore?.name ?? 'core/notices';

/**
 * Internal dependencies
 */
import { PageTitle } from '../page-title';
import { SettingsTable } from '../settings';
import type { Settings } from '../../types';

export type LayoutProps = {
	readonly settings: Settings;
};

export const Layout = ( { settings }: LayoutProps ): JSX.Element => {
	const { hideTitle } = settings;
	const notices = useNotices();
	const { removeNotice } = useDispatch( NOTICES );

	return (
		<>
			{ ! hideTitle && <PageTitle /> }
			<NoticeList
				notices={ notices }
				className="components-editor-notices__pinned"
				onRemove={ removeNotice }
			/>
			<SettingsTable settings={ settings } />
		</>
	);
};

// =====
// HOOKS
// =====

import type { Notice } from 'wordpress__notices';
const useNotices = (): ReadonlyArray< Notice > =>
	useSelect( ( select ) => select( NOTICES ).getNotices() );
