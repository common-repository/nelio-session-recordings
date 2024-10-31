/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useEffect } from '@safe-wordpress/element';
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
import type { Uuid } from '@neliosr/types';

/**
 * Internal dependencies
 */
import { useInactiveSkipperEffect } from '../../hooks';

export type ProviderProps = {
	readonly recordingId: Uuid;
	readonly clickAudioFile: string;
	readonly children: JSX.Element | JSX.Element[];
};

export const Provider = ( {
	recordingId,
	clickAudioFile,
	children,
}: ProviderProps ): JSX.Element => {
	const isLoading = useIsLoading( recordingId );
	const hasError = useHasError( recordingId );
	const notices = useNotices();
	const { removeNotice } = useDispatch( NOTICES );
	const { setPageAttribute } = useDispatch( STORE_NAME );

	useInactiveSkipperEffect();
	useEffect( () => {
		setPageAttribute( 'recording/clickAudioFile', clickAudioFile );
	}, [ clickAudioFile ] );

	if ( isLoading ) {
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

const useIsLoading = ( recordingId: Uuid ) =>
	useSelect( ( select ) => {
		select( STORE_NAME ).getRecording( recordingId );
		return ! select( STORE_NAME ).hasFinishedResolution( 'getRecording', [
			recordingId,
		] );
	} );

const useHasError = ( recordingId: Uuid ) =>
	useSelect( ( select ) =>
		select( STORE_NAME ).hasResolutionFailed( 'getRecording', [
			recordingId,
		] )
	);

import type { Notice } from 'wordpress__notices';
const useNotices = (): ReadonlyArray< Notice > =>
	useSelect( ( select ) => select( NOTICES ).getNotices() );
