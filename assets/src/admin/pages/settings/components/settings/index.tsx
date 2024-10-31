/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import apiFetch from '@safe-wordpress/api-fetch';
import {
	Button,
	CheckboxControl,
	RangeControl,
	SelectControl,
	TextareaControl,
	TextControl,
} from '@safe-wordpress/components';
import { useState } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { NumberControl } from '@neliosr/components';
import { createErrorNotice } from '@neliosr/utils';

/**
 * Internal dependencies
 */
import './style.scss';
import type { Settings } from '../../types';

type SettingsTableProps = {
	readonly settings: Settings;
};

export const SettingsTable = ( {
	settings,
}: SettingsTableProps ): JSX.Element => {
	const [ isLoading, setIsLoading ] = useState( false );
	const [ showHelp, setShowHelp ] = useState( false );
	const [ currentSettings, updateSettings ] = useState( settings );
	return (
		<>
			<h2>
				{ _x(
					'Recording Settings',
					'text',
					'nelio-session-recordings'
				) }
			</h2>
			<table
				className="form-table neliosr-recording-settings"
				role="presentation"
			>
				<tbody>
					<tr>
						<th scope="row">
							<span>
								{ _x(
									'GDPR Cookie',
									'text',
									'nelio-session-recordings'
								) }
							</span>
						</th>
						<td>
							{ !! currentSettings.isNabActive && (
								<CheckboxControl
									label={ _x(
										'Customize default behavior',
										'text',
										'nelio-session-recordings'
									) }
									disabled={ isLoading }
									checked={
										!! currentSettings.gdprCookie?.customize
									}
									onChange={ ( isChecked ) =>
										updateSettings( {
											...currentSettings,
											gdprCookie: {
												customize: isChecked,
												name:
													currentSettings.gdprCookie
														?.name || '',
												value:
													currentSettings.gdprCookie
														?.value || '',
											},
										} )
									}
								/>
							) }
							{ ( ! currentSettings.isNabActive ||
								!! currentSettings.gdprCookie?.customize ) && (
								<>
									<div
										className="neliosr-component-with-help"
										style={ {
											marginTop:
												currentSettings.isNabActive
													? '1em'
													: 'auto',
										} }
									>
										<span
											className="dashicons dashicons-editor-help neliosr-description-icon"
											onClick={ () =>
												setShowHelp( ! showHelp )
											}
											aria-hidden="true"
										></span>
										<TextControl
											value={
												currentSettings.gdprCookie
													?.name || ''
											}
											disabled={ isLoading }
											onChange={ ( newName ) =>
												updateSettings( {
													...currentSettings,
													gdprCookie: {
														name: newName,
														customize: true,
														value:
															currentSettings
																.gdprCookie
																?.value || '',
													},
												} )
											}
											placeholder={ _x(
												'Cookie Name',
												'text',
												'nelio-session-recordings'
											) }
										/>
									</div>
									{ !! currentSettings.gdprCookie?.name && (
										<TextControl
											className="neliosr-recording-settings__gdpr-cookie-value"
											disabled={ isLoading }
											value={
												currentSettings.gdprCookie
													?.value || ''
											}
											onChange={ ( newValue ) =>
												updateSettings( {
													...currentSettings,
													gdprCookie: {
														name:
															currentSettings
																.gdprCookie
																?.name || '',
														value: newValue,
														customize: true,
													},
												} )
											}
											placeholder={ _x(
												'Optional Cookie Value',
												'text',
												'nelio-session-recordings'
											) }
										/>
									) }
									{ !! showHelp && (
										<div className="neliosr-setting-description">
											<p>
												{ _x(
													'The name of the cookie that should exist if GDPR has been accepted and, therefore, tracking is allowed. Leave empty if you don’t need to adhere to GDPR and want to track all your visitors.',
													'user',
													'nelio-session-recordings'
												) }
											</p>
											<p>
												{ _x(
													'If you want to, you can also specify the value the cookie should have to enable visitor tracking.',
													'user',
													'nelio-session-recordings'
												) }
											</p>
											<p>
												{ _x(
													'Use asterisks (*) to match any number of characters at any point.',
													'user',
													'nelio-session-recordings'
												) }
											</p>
										</div>
									) }
								</>
							) }
						</td>
					</tr>
					<tr>
						<th scope="row">
							<span>
								{ _x(
									'Tracking settings',
									'text',
									'nelio-session-recordings'
								) }
							</span>
						</th>
						<td>
							<CheckboxControl
								label={ _x(
									'Capture sessions shorter than 30 seconds',
									'command',
									'nelio-session-recordings'
								) }
								disabled={ isLoading }
								checked={ currentSettings.trackShortSessions }
								onChange={ ( isChecked ) =>
									updateSettings( {
										...currentSettings,
										trackShortSessions: isChecked,
									} )
								}
							/>
						</td>
					</tr>
					<tr>
						<th scope="row">
							<span>
								{ _x(
									'Sampling rate',
									'text',
									'nelio-session-recordings'
								) }
							</span>
						</th>
						<td>
							<SelectControl
								className="neliosr-recording-settings__sampling-rate-selector"
								disabled={ isLoading }
								value={ currentSettings.samplingRate.mode }
								help={ getHelpText(
									currentSettings.samplingRate.mode
								) }
								options={ OPTIONS }
								// eslint-disable-next-line no-console
								onChange={ (
									mode: Settings[ 'samplingRate' ][ 'mode' ]
								) =>
									updateSettings( {
										...currentSettings,
										samplingRate: onModeChange(
											mode,
											currentSettings.samplingRate
										),
									} )
								}
							/>
							{ currentSettings.samplingRate.mode ===
								'custom' && (
								<RangeControl
									className="neliosr-recording-settings__sampling-rate-percentage"
									label={ _x(
										'Percentage of tracked sessions (%)',
										'text',
										'nelio-session-recordings'
									) }
									disabled={ isLoading }
									value={
										currentSettings.samplingRate.percentage
									}
									onChange={ ( percentage ) =>
										updateSettings( {
											...currentSettings,
											samplingRate: {
												mode: 'custom',
												percentage: percentage || 100,
											},
										} )
									}
									initialPosition={ 100 }
									min={ 0 }
									max={ 100 }
									step={ 1 }
									{ ...{
										renderTooltipContent: (
											value: number
										) => `${ value }%`,
									} }
								/>
							) }
							{ currentSettings.samplingRate.mode ===
								'uniform' && (
								<NumberControl
									className="neliosr-recording-settings__sampling-rate-amount"
									label={ _x(
										'Estimated amount of monthly sessions',
										'text',
										'nelio-session-recordings'
									) }
									value={
										currentSettings.samplingRate
											.estimatedSessions
									}
									min={ 0 }
									onChange={ ( amount ) =>
										updateSettings( {
											...currentSettings,
											samplingRate: {
												mode: 'uniform',
												estimatedSessions: amount || 0,
											},
										} )
									}
								/>
							) }
						</td>
					</tr>

					<tr>
						<th scope="row">
							<span>
								{ _x(
									'Scope URLs',
									'text',
									'nelio-session-recordings'
								) }
							</span>
						</th>
						<td>
							<TextareaControl
								className="neliosr-recording-settings__recordings-scope"
								disabled={ isLoading }
								cols={ 50 }
								value={ currentSettings.recordingsScope.join(
									'\n'
								) }
								onChange={ ( text ) =>
									updateSettings( {
										...currentSettings,
										recordingsScope: text.split( '\n' ),
									} )
								}
								placeholder={ _x(
									'One URL per line',
									'text',
									'nelio-session-recordings'
								) }
								help={ _x(
									'Use this field to specify the URL(s) where recordings should be tracked. Please write one URL or URL fragment per line. Leave empty to track recordings on the whole site.',
									'user',
									'nelio-session-recordings'
								) }
							/>
						</td>
					</tr>
				</tbody>
			</table>
			<Button
				variant="primary"
				disabled={ isLoading }
				isBusy={ isLoading }
				onClick={ () => {
					setIsLoading( true );
					void apiFetch( {
						path: '/neliosr/v1/settings',
						method: 'POST',
						data: { settings: currentSettings },
					} )
						.catch( ( error ) => {
							createErrorNotice(
								error,
								_x(
									'Error while accessing amount of active recordings.',
									'text',
									'nelio-session-recordings'
								)
							);
						} )
						.finally( () => {
							setIsLoading( false );
						} );
				} }
			>
				{ _x( 'Save Changes', 'command', 'nelio-session-recordings' ) }
			</Button>
		</>
	);
};

function onModeChange(
	mode: Settings[ 'samplingRate' ][ 'mode' ],
	samplingRate: Settings[ 'samplingRate' ]
): Settings[ 'samplingRate' ] {
	switch ( mode ) {
		case 'unlimited':
			return { mode };

		case 'uniform':
			return {
				mode,
				estimatedSessions:
					samplingRate.mode === 'uniform'
						? samplingRate.estimatedSessions
						: 5000,
			};

		case 'custom':
			return {
				mode,
				percentage:
					samplingRate.mode === 'custom'
						? samplingRate.percentage
						: 75,
			};
	}
} //end onModeChange

function getHelpText( mode: Settings[ 'samplingRate' ][ 'mode' ] ): string {
	switch ( mode ) {
		case 'unlimited':
			return _x(
				'Every visitor session will be recorded until you run out of quota',
				'text',
				'nelio-session-recordings'
			);

		case 'uniform':
			return _x(
				'Record your sessions evenly throughout the calendar month',
				'text',
				'nelio-session-recordings'
			);

		case 'custom':
			return _x(
				'A percentage of your visitor sessions will be recorded',
				'text',
				'nelio-session-recordings'
			);
	}
} //end getHelpText()

const OPTIONS: ReadonlyArray< {
	readonly value: Settings[ 'samplingRate' ][ 'mode' ];
	readonly label: string;
} > = [
	{
		value: 'unlimited',
		label: _x( 'Unlimited', 'text', 'nelio-content' ),
	},
	{
		value: 'uniform',
		label: _x( 'Uniform', 'text', 'nelio-content' ),
	},
	{
		value: 'custom',
		label: _x( 'Custom percentage', 'text', 'nelio-content' ),
	},
];
