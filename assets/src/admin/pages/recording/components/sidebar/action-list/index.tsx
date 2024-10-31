/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, PanelBody, PanelRow } from '@safe-wordpress/components';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classNames from 'classnames';
import { Icon, PageUrl } from '@neliosr/components';
import { usePageAttribute } from '@neliosr/data';
import { formatDuration } from '@neliosr/date';
import {
	EventType,
	IncrementalSource,
	MediaInteractions,
	MouseInteractions,
} from '@rrweb/types';
import type {
	eventWithTime as Event,
	nelioFullSnapshotEvent,
	nelioMouseInteractionData,
} from '@rrweb/types';
import { NabEventPayload } from '@neliosr/types';

/**
 * Internal dependencies
 */
import './style.scss';
import {
	useIsPlayerReady,
	useStartTimestamp,
	useTimestampSetter,
} from '../../../hooks';
import { NabEvent } from './nab-event';

export const ActionList = (): JSX.Element | null => {
	const isReady = useIsPlayerReady();
	const setTimestamp = useTimestampSetter();
	const startTimestamp = useStartTimestamp();
	const [ currentTime ] = usePageAttribute( 'recording/currentTime' );
	const [ validEvents ] = usePageAttribute( 'recording/validEvents' );

	if ( ! isReady ) {
		return null;
	} //end if

	return (
		<PanelBody
			className="neliosr-recording-actions"
			title={ _x(
				'Actions',
				'text (recording)',
				'nelio-session-recordings'
			) }
		>
			{ validEvents.map( ( event, index ) => (
				<PanelRow
					className={ classNames( 'neliosr-recording-action', {
						'neliosr-recording-action--playing':
							event.timestamp <= currentTime &&
							next( validEvents, index ).timestamp > currentTime,
						'neliosr-recording-action--is_page': isPage( event ),
						'neliosr-recording-action--is_rage_click':
							isRageClick( event ),
						'neliosr-recording-action--is_nab_event':
							isNabEvent( event ),
					} ) }
					key={ index }
				>
					<Button
						variant="link"
						onClick={ () => setTimestamp( event.timestamp ) }
					>
						<div className="neliosr-recording-action__content">
							<div className="neliosr-recording-action__icon">
								{ getIcon( event ) }
							</div>
							<div className="neliosr-recording-action__label">
								{ getLabel( event ) }
							</div>
							<div className="neliosr-recording-action__time">
								{ formatDuration(
									event.timestamp - startTimestamp,
									'milliseconds'
								) }
							</div>
						</div>
					</Button>
				</PanelRow>
			) ) }
		</PanelBody>
	);
};

// =======
// HELPERS
// =======

const next = (
	events: ReadonlyArray< Event >,
	index: number
): { timestamp: number } =>
	events[ index + 1 ] ?? { timestamp: Number.POSITIVE_INFINITY };

const getIcon = ( e: Event ): JSX.Element | null => {
	switch ( e.type ) {
		case EventType.DomContentLoaded:
		case EventType.Load:
			return null;
		case EventType.FullSnapshot:
			const snapshotData: nelioFullSnapshotEvent[ 'data' ] = e.data;
			if ( snapshotData.isUTurn ) {
				return <Icon icon="pageUTurn" />;
			} //end if

			if ( snapshotData.isRefresh ) {
				return <Icon icon="pageReload" />;
			} //end if

			return <Icon icon="page" />;
		case EventType.Custom:
			return <Icon icon="nabLogo" />;
		case EventType.Plugin:
			return null;
		case EventType.IncrementalSnapshot:
			switch ( e.data.source ) {
				case IncrementalSource.Mutation:
					return null;
				case IncrementalSource.MouseMove:
					return <Icon icon="mouseMove" />;
				case IncrementalSource.MouseInteraction:
					switch ( e.data.type ) {
						case MouseInteractions.MouseUp:
						case MouseInteractions.MouseDown:
							return null;
						case MouseInteractions.Click:
							const mouseData: nelioMouseInteractionData = e.data;
							if ( mouseData.isRageClick ) {
								return <Icon icon="rage" />;
							} //end if

							if (
								mouseData.clickedElement &&
								typeof mouseData.clickedElement.isClickable !==
									'undefined' &&
								! mouseData.clickedElement.isClickable
							) {
								return <Icon icon="dead" />;
							} //end if

							return <Icon icon="mouseClick" />;
						case MouseInteractions.ContextMenu:
							return null;
						case MouseInteractions.DblClick:
							return <Icon icon="mouseClick" />;
						case MouseInteractions.Focus:
						case MouseInteractions.Blur:
						case MouseInteractions.TouchStart:
						case MouseInteractions.TouchMove_Departed:
						case MouseInteractions.TouchEnd:
						case MouseInteractions.TouchCancel:
							return null;
					} //end switch
					return null;
				case IncrementalSource.Scroll:
					return <Icon icon="scroll" />;
				case IncrementalSource.ViewportResize:
					return <Icon icon="resize" />;
				case IncrementalSource.Input:
					return <Icon icon="input" />;
				case IncrementalSource.MediaInteraction:
					switch ( e.data.type ) {
						case MediaInteractions.Play:
							return <Icon icon="play" />;
						case MediaInteractions.Pause:
							return <Icon icon="pause" />;
						case MediaInteractions.RateChange:
						case MediaInteractions.Seeked:
							return null;
						case MediaInteractions.VolumeChange:
							return <Icon icon="volume" />;
					} //end switch
					return null;
				case IncrementalSource.StyleSheetRule:
				case IncrementalSource.CanvasMutation:
				case IncrementalSource.Font:
					return null;
				case IncrementalSource.Selection:
					return <Icon icon="selection" />;
				case IncrementalSource.StyleDeclaration:
				case IncrementalSource.AdoptedStyleSheet:
					return null;
			} //end switch
			return <Icon icon="video" />;
		case EventType.Meta:
			return <Icon icon="page" />;
	} //end switch
};

const getLabel = ( e: Event ): JSX.Element | string => {
	switch ( e.type ) {
		case EventType.DomContentLoaded:
		case EventType.Load:
			return '';
		case EventType.FullSnapshot:
			const snapshotData: nelioFullSnapshotEvent[ 'data' ] = e.data;
			return <PageUrl url={ snapshotData.href || '' } />;
		case EventType.Custom:
			return <NabEvent event={ e.data.payload as NabEventPayload } />;
		case EventType.Plugin:
			return '';
		case EventType.IncrementalSnapshot:
			switch ( e.data.source ) {
				case IncrementalSource.Mutation:
					return '';
				case IncrementalSource.MouseMove:
					return _x(
						'Mouse move',
						'text',
						'nelio-session-recordings'
					);
				case IncrementalSource.MouseInteraction:
					switch ( e.data.type ) {
						case MouseInteractions.MouseUp:
						case MouseInteractions.MouseDown:
							return '';
						case MouseInteractions.Click:
							const mouseData: nelioMouseInteractionData = e.data;
							if ( mouseData.isRageClick ) {
								return _x(
									'Rage click',
									'text',
									'nelio-session-recordings'
								);
							} //end if

							if (
								mouseData.clickedElement &&
								typeof mouseData.clickedElement.isClickable !==
									'undefined' &&
								! mouseData.clickedElement.isClickable
							) {
								return _x(
									'Dead click',
									'text',
									'nelio-session-recordings'
								);
							} //end if

							return _x(
								'Mouse click',
								'text',
								'nelio-session-recordings'
							);
						case MouseInteractions.ContextMenu:
						case MouseInteractions.DblClick:
							return _x(
								'Mouse double click',
								'text',
								'nelio-session-recordings'
							);
						case MouseInteractions.Focus:
						case MouseInteractions.Blur:
						case MouseInteractions.TouchStart:
						case MouseInteractions.TouchMove_Departed:
						case MouseInteractions.TouchEnd:
						case MouseInteractions.TouchCancel:
							return '';
					} //end switch
					return '';
				case IncrementalSource.Scroll:
					return _x( 'Scroll', 'text', 'nelio-session-recordings' );
				case IncrementalSource.ViewportResize:
					return sprintf(
						/* translators: 1 -> width, 2 -> height */
						_x(
							'Resize window: %1$s x %2$s',
							'text',
							'nelio-session-recordings'
						),
						e.data.width,
						e.data.height
					);
				case IncrementalSource.Input:
					return _x( 'Input', 'text', 'nelio-session-recordings' );
				case IncrementalSource.MediaInteraction:
					switch ( e.data.type ) {
						case MediaInteractions.Play:
							return _x(
								'Play',
								'text',
								'nelio-session-recordings'
							);
						case MediaInteractions.Pause:
							return _x(
								'Pause',
								'text',
								'nelio-session-recordings'
							);
						case MediaInteractions.RateChange:
						case MediaInteractions.Seeked:
							return '';
						case MediaInteractions.VolumeChange:
							return _x(
								'Volume change',
								'text',
								'nelio-session-recordings'
							);
					} //end switch
					return '';
				case IncrementalSource.StyleSheetRule:
				case IncrementalSource.CanvasMutation:
				case IncrementalSource.Font:
					return '';
				case IncrementalSource.Selection:
					return _x(
						'Selection',
						'text',
						'nelio-session-recordings'
					);
				case IncrementalSource.StyleDeclaration:
				case IncrementalSource.AdoptedStyleSheet:
					return '';
			} //end switch
			return '';
		case EventType.Meta:
			return <PageUrl url={ e.data.href || '' } />;
	} //end switch
};

const isPage = ( e: Event ): boolean =>
	( e.type === EventType.FullSnapshot &&
		!! ( e as nelioFullSnapshotEvent ).data.href ) ||
	e.type === EventType.Meta;

const isRageClick = ( e: Event ): boolean =>
	e.type === EventType.IncrementalSnapshot &&
	e.data.source === IncrementalSource.MouseInteraction &&
	!! ( e.data as nelioMouseInteractionData ).isRageClick;

const isNabEvent = ( e: Event ): boolean =>
	e.type === EventType.Custom && e.data.tag === 'nab-event';
