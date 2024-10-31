/**
 * WordPress dependencies
 */
import { useSelect } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { STORE_NAME } from '@neliosr/data';
import type { SessionRecording, Maybe } from '@neliosr/types';

export function useRecordingAttribute< K extends keyof SessionRecording >(
	attr: K
): Maybe< SessionRecording[ K ] > {
	const recording = useSelect( ( select ) =>
		select( STORE_NAME ).getPageAttribute( 'recording/activeId' )
	);
	const value = useSelect( ( select ) =>
		!! recording
			? ( select( STORE_NAME ).getRecordingAttribute(
					recording,
					attr
			  ) as SessionRecording[ K ] )
			: undefined
	);
	return value;
} //end useRecordingAttribute()
