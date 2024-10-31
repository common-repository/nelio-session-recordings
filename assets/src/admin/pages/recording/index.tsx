/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import '@safe-wordpress/dom-ready';
import '@safe-wordpress/notices';
import { render } from '@safe-wordpress/element';

/**
 * External dependencies
 */
import type { Uuid } from '@neliosr/types';

/**
 * Internal dependencies
 */
import { Layout } from './components/layout';
import { Provider } from './components/provider';

type Settings = {
	readonly recording: Uuid;
	readonly clickAudioFile: string;
};
export function initPage( id: string, settings: Settings ): void {
	const content = document.getElementById( id );
	const recording = settings.recording;
	render(
		<div className="wrap">
			<Provider
				recordingId={ recording }
				clickAudioFile={ settings.clickAudioFile }
			>
				<Layout />
			</Provider>
		</div>,
		content
	);
} //end initPage()
