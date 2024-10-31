/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { PanelBody, PanelRow } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import {
	Browser,
	CountryFlag,
	Device,
	Icon,
	OperatingSystem,
	PageUrl,
	Tooltip,
} from '@neliosr/components';
import { formatI18nDatetime, humanTimeDiff } from '@neliosr/date';
import { getCountryName, maybeFixId } from '@neliosr/utils';
import { Uuid } from '@neliosr/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { useRecordingAttribute } from '../../hooks';
import { RemoveAction } from './remove-action';

export const Summary = (): JSX.Element => {
	const recordingId = ( useRecordingAttribute( 'id' ) || '' ) as Uuid;
	const browser = useRecordingAttribute( 'browser' ) || '';
	const country = useRecordingAttribute( 'country' ) || '';
	const device = useRecordingAttribute( 'device' ) || '';
	const exit = useRecordingAttribute( 'exit' );
	const landing = useRecordingAttribute( 'landing' );
	const os = useRecordingAttribute( 'os' ) || '';
	const timestamp = useRecordingAttribute( 'first' ) || '';
	const isExample = useRecordingAttribute( 'isExample' ) || false;

	return (
		<PanelBody
			className="neliosr-recording-summary"
			title={ _x(
				'Session summary',
				'text (recording)',
				'nelio-session-recordings'
			) }
		>
			<PanelRow className="neliosr-recording-summary__row">
				<Icon icon="video" />
				<span className="neliosr-recording-summary__row-description">
					<Tooltip text={ maybeFixId( recordingId ) }>
						<div className="neliosr-ellipsis">
							{ maybeFixId( recordingId ) }
						</div>
					</Tooltip>
				</span>
			</PanelRow>
			<PanelRow className="neliosr-recording-summary__row">
				<Icon icon="calendar" />
				<span className="neliosr-recording-summary__row-description">
					{ humanTimeDiff( timestamp, new Date() ) }
					{ ' - ' }
					{ formatI18nDatetime( timestamp ) }
				</span>
			</PanelRow>
			<PanelRow className="neliosr-recording-summary__row">
				<CountryFlag country={ country } />
				<span className="neliosr-recording-summary__row-description">
					{ getCountryName( country.toUpperCase() ) }
				</span>
			</PanelRow>
			<PanelRow className="neliosr-recording-summary__row">
				<Device type={ device } showTooltip={ false } />
				<span className="neliosr-recording-summary__row-description">
					{ getDeviceName( device ) }
				</span>
			</PanelRow>
			<PanelRow className="neliosr-recording-summary__row">
				<Browser type={ browser } showTooltip={ false } />
				<span className="neliosr-recording-summary__row-description">
					{ browser }
				</span>
			</PanelRow>
			<PanelRow className="neliosr-recording-summary__row">
				<OperatingSystem type={ os } showTooltip={ false } />
				<span className="neliosr-recording-summary__row-description">
					{ os }
				</span>
			</PanelRow>
			{ !! landing && (
				<PanelRow className="neliosr-recording-summary__row">
					<Icon icon="landing" />
					<span className="neliosr-recording-summary__row-description">
						<PageUrl url={ landing } isLink />
					</span>
				</PanelRow>
			) }
			{ !! exit && (
				<PanelRow className="neliosr-recording-summary__row">
					<Icon icon="exit" />
					<span className="neliosr-recording-summary__row-description">
						<PageUrl url={ exit } isLink />
					</span>
				</PanelRow>
			) }
			{ ! isExample && (
				<PanelRow className="neliosr-recording-summary__row">
					<RemoveAction id={ recordingId } />
				</PanelRow>
			) }
		</PanelBody>
	);
};

// =======
// HELPERS
// =======

function getDeviceName( device: string ) {
	// console, mobile, tablet, smarttv, wearable, embedded, desktop
	switch ( device ) {
		case 'mobile':
			return _x( 'Mobile', 'text', 'nelio-session-recordings' );
		case 'tablet':
			return _x( 'Tablet', 'text', 'nelio-session-recordings' );
		default:
			return _x( 'Desktop', 'text', 'nelio-session-recordings' );
	} //end switch
} //end getDeviceName()
