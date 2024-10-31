/**
 * External dependencies
 */
import { castArray } from 'lodash';
import type { PluginSettings } from '@neliosr/types';

export type SettingsAction =
	| SetToday
	| ReceiveRecordingStatus
	| ReceivePlugins
	| ReceivePluginSettings;

export function receiveRecordingStatus(
	status: boolean
): ReceiveRecordingStatus {
	return {
		type: 'RECEIVE_RECORDING_STATUS',
		recordingStatus: status,
	};
} //end receiveRecordingStatus()

export function setToday( today: string ): SetToday {
	return {
		type: 'SET_TODAY',
		today,
	};
} //end setToday()

export function receivePlugins(
	plugins: string | ReadonlyArray< string >
): ReceivePlugins {
	return {
		type: 'RECEIVE_PLUGINS',
		plugins: castArray( plugins ),
	};
} //end receivePlugins()

export function receivePluginSettings(
	settings: PluginSettings
): ReceivePluginSettings {
	return {
		type: 'RECEIVE_PLUGIN_SETTINGS',
		settings,
	};
} //end receivePluginSettings()

// ============
// HELPER TYPES
// ============

type ReceiveRecordingStatus = {
	readonly type: 'RECEIVE_RECORDING_STATUS';
	readonly recordingStatus: boolean;
};

type SetToday = {
	readonly type: 'SET_TODAY';
	readonly today: string;
};

type ReceivePlugins = {
	readonly type: 'RECEIVE_PLUGINS';
	readonly plugins: ReadonlyArray< string >;
};

type ReceivePluginSettings = {
	readonly type: 'RECEIVE_PLUGIN_SETTINGS';
	readonly settings: PluginSettings;
};
