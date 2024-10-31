/**
 * WordPress dependencies
 */
import { addQueryArgs } from '@safe-wordpress/url';

/**
 * Internal dependencies
 */
import type { State } from '../types';

export function getRecordingStatus( state: State ): boolean {
	return state.settings.recordingStatus;
} //end getRecordingStatus()

export function getToday( state: State ): string {
	return state.settings.today;
} //end getToday()

export function getActivePlugins( state: State ): ReadonlyArray< string > {
	return state.settings.plugins;
} //end getActivePlugins()

export function getPluginSetting<
	K extends keyof State[ 'settings' ][ 'nelio' ],
>( state: State, name: K ): State[ 'settings' ][ 'nelio' ][ K ] {
	return state.settings.nelio[ name ];
} //end getPluginSetting()

export function getAdminUrl(
	state: State,
	path: string,
	args: Record< string, string | boolean | number >
): string {
	const adminUrl = getPluginSetting( state, 'adminUrl' );
	return addQueryArgs( `${ adminUrl }${ path }`, args );
} //end getAdminUrl()

export function getHomeUrl(
	state: State,
	path: string,
	args: Record< string, string | boolean | number >
): string {
	const homeUrl = getPluginSetting( state, 'homeUrl' );
	return addQueryArgs( `${ homeUrl }${ path }`, args );
} //end getHomeUrl()
