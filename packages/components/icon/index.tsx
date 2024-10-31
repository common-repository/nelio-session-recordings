/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import { Tooltip } from '../tooltip';
import './style.scss';

import defaultIcon from './assets/default.svg';
import androidIcon from './assets/android.svg';
import appleIcon from './assets/apple.svg';
import appleIOSIcon from './assets/apple-ios.svg';
import arrowULeftIcon from './assets/arrow-u-left.svg';
import calendarIcon from './assets/calendar.svg';
import cellphoneIcon from './assets/cellphone.svg';
import chevronDownIcon from './assets/chevron-down.svg';
import chevronLeftIcon from './assets/chevron-left.svg';
import chevronRightIcon from './assets/chevron-right.svg';
import chevronUpIcon from './assets/chevron-up.svg';
import columnsIcon from './assets/columns.svg';
import deadIcon from './assets/dead.svg';
import downloadIcon from './assets/download.svg';
import exitIcon from './assets/exit.svg';
import filterIcon from './assets/filter.svg';
import firefoxIcon from './assets/firefox.svg';
import googleChromeIcon from './assets/google-chrome.svg';
import inputIcon from './assets/input.svg';
import internetExplorerIcon from './assets/internet-explorer.svg';
import landingIcon from './assets/landing.svg';
import linkIcon from './assets/link.svg';
import linuxIcon from './assets/linux.svg';
import microsoftEdgeIcon from './assets/microsoft-edge.svg';
import monitorIcon from './assets/monitor.svg';
import monitorCellphoneIcon from './assets/monitor-cellphone.svg';
import mouseClickIcon from './assets/mouse-click.svg';
import mouseMoveIcon from './assets/mouse-move.svg';
import nabLogoIcon from './assets/nab-logo.svg';
import operaIcon from './assets/opera.svg';
import pageIcon from './assets/page.svg';
import pageReloadIcon from './assets/page-reload.svg';
import pageUTurnIcon from './assets/page-uturn.svg';
import pauseIcon from './assets/pause.svg';
import playIcon from './assets/play.svg';
import rageIcon from './assets/rage.svg';
import refreshIcon from './assets/refresh.svg';
import resizeIcon from './assets/resize.svg';
import safariIcon from './assets/safari.svg';
import scrollIcon from './assets/scroll.svg';
import selectionIcon from './assets/selection.svg';
import tabletIcon from './assets/tablet.svg';
import trashIcon from './assets/trash.svg';
import ubuntuIcon from './assets/ubuntu.svg';
import videoIcon from './assets/video.svg';
import volumeIcon from './assets/volume.svg';
import webIcon from './assets/web.svg';
import windowsIcon from './assets/windows.svg';

const icons = {
	default: defaultIcon,
	android: androidIcon,
	apple: appleIcon,
	appleIOS: appleIOSIcon,
	arrowULeft: arrowULeftIcon,
	calendar: calendarIcon,
	cellphone: cellphoneIcon,
	chevronDown: chevronDownIcon,
	chevronLeft: chevronLeftIcon,
	chevronRight: chevronRightIcon,
	chevronUp: chevronUpIcon,
	columns: columnsIcon,
	dead: deadIcon,
	download: downloadIcon,
	exit: exitIcon,
	filter: filterIcon,
	firefox: firefoxIcon,
	googleChrome: googleChromeIcon,
	input: inputIcon,
	internetExplorer: internetExplorerIcon,
	landing: landingIcon,
	link: linkIcon,
	linux: linuxIcon,
	microsoftEdge: microsoftEdgeIcon,
	monitor: monitorIcon,
	monitorCellphone: monitorCellphoneIcon,
	mouseClick: mouseClickIcon,
	mouseMove: mouseMoveIcon,
	nabLogo: nabLogoIcon,
	opera: operaIcon,
	page: pageIcon,
	pageReload: pageReloadIcon,
	pageUTurn: pageUTurnIcon,
	pause: pauseIcon,
	play: playIcon,
	rage: rageIcon,
	refresh: refreshIcon,
	resize: resizeIcon,
	safari: safariIcon,
	scroll: scrollIcon,
	selection: selectionIcon,
	tablet: tabletIcon,
	trash: trashIcon,
	ubuntu: ubuntuIcon,
	video: videoIcon,
	volume: volumeIcon,
	web: webIcon,
	windows: windowsIcon,
};

export type IconProps = {
	readonly icon?: keyof typeof icons;
	readonly className?: string;
	readonly tooltip?: string;
};

export const Icon = ( {
	icon,
	className,
	tooltip,
}: IconProps ): JSX.Element => {
	const MaybeIcon = icon ? icons[ icon ] : undefined;
	const Component = MaybeIcon ?? icons.default;
	className = classnames( [ 'neliosr-icon', className ] );

	return !! tooltip ? (
		<Tooltip text={ tooltip }>
			<div style={ { width: 'min-content' } }>
				<Component className={ className } />
			</div>
		</Tooltip>
	) : (
		<Component className={ className } />
	);
};
