/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { NoticeList } from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';
import { store as noticesStore } from '@safe-wordpress/notices';

const NOTICES = noticesStore?.name ?? 'core/notices';

/**
 * External dependencies
 */
import { LoadingAnimation } from '@neliosr/components';
import { STORE_NAME } from '@neliosr/data';
import { ROWS_PER_PAGE_OPTIONS } from '@neliosr/utils';

export type ProviderProps = {
	readonly children: JSX.Element | JSX.Element[];
};

export const Provider = ( { children }: ProviderProps ): JSX.Element => {
	const isLoading = useIsLoading();
	const hasError = useHasError();
	const notices = useNotices();
	const { removeNotice } = useDispatch( NOTICES );

	if ( isLoading && ! hasError ) {
		return (
			<LoadingAnimation
				text={ _x( 'Loading…', 'text', 'nelio-session-recordings' ) }
			/>
		);
	} //end if

	return (
		<>
			<NoticeList
				notices={ notices }
				className="components-editor-notices__pinned"
				onRemove={ removeNotice }
			/>
			{ ! hasError && children }
		</>
	);
};

// =====
// HOOKS
// =====

const useIsLoading = () =>
	useSelect( ( select ) => {
		const items = select( STORE_NAME ).getRecordings();
		return (
			! select( STORE_NAME ).areAllRecordingsLoaded() &&
			items.length < ROWS_PER_PAGE_OPTIONS[ 0 ]
		);
	} );

const useHasError = () =>
	useSelect( ( select ) =>
		select( STORE_NAME ).hasResolutionFailed( 'getRecordings' )
	);

import type { Notice } from 'wordpress__notices';
const useNotices = (): ReadonlyArray< Notice > =>
	useSelect( ( select ) => select( NOTICES ).getNotices() );
