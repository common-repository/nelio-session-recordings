/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect } from '@safe-wordpress/data';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { STORE_NAME } from '@neliosr/data';
import { numberFormat } from '@neliosr/i18n';
import type { Maybe, Quota } from '@neliosr/types';

/**
 * Internal dependencies
 */
import './style.scss';

export type QuotaMeterProps = {
	readonly disabled?: boolean;
	readonly subscriptionQuota?: Quota;
};

export const QuotaMeter = ( {
	disabled,
	subscriptionQuota,
}: QuotaMeterProps ): JSX.Element => {
	const { quota, status } = useQuota( subscriptionQuota );

	const isLoading = ! quota;
	const isBarDisabled = disabled || isLoading;

	const { availableQuota = 0, percentage = 100 } = quota ?? {};

	return (
		<div className="neliosr-quota-meter">
			<p className="neliosr-quota-meter__title">
				{ _x( 'Quota', 'text', 'nelio-session-recordings' ) }

				<AmountLabel mode={ status } quota={ availableQuota } />
			</p>

			<Bar disabled={ isBarDisabled } percentage={ percentage } />
		</div>
	);
};

// ============
// HELPER VIEWS
// ============

const AmountLabel = ( {
	mode,
	quota,
}: {
	readonly mode: 'ready' | 'loading' | 'error';
	readonly quota: number;
} ) => {
	if ( 'loading' === mode ) {
		return (
			<span className="neliosr-quota-meter__amount">
				{ _x( 'Loading…', 'text', 'nelio-session-recordings' ) }
			</span>
		);
	} //end if

	if ( 'error' === mode ) {
		return (
			<span className="neliosr-quota-meter__amount">
				{ _x(
					'Unable to retrieve quota',
					'text',
					'nelio-session-recordings'
				) }
			</span>
		);
	} //end if

	return (
		<span className="neliosr-quota-meter__amount">
			{ quota > 0
				? sprintf(
						/* translators: quota number */
						_x(
							'%s available page views',
							'text',
							'nelio-session-recordings'
						),
						numberFormat( quota )
				  )
				: _x(
						'There are no more available page views',
						'text',
						'nelio-session-recordings'
				  ) }
		</span>
	);
};

const Bar = ( {
	disabled,
	percentage,
}: {
	readonly disabled: boolean;
	readonly percentage: number;
} ) => {
	const size = percentage.toFixed( 0 );

	if ( 100 === percentage ) {
		return (
			<div className="neliosr-quota-meter__bar-container">
				<span
					className={ classnames(
						'neliosr-quota-meter__bar',
						`neliosr-quota-meter__bar--width-${ size }`,
						{ 'neliosr-quota-meter__bar--disabled': disabled }
					) }
				></span>
			</div>
		);
	} //end if

	return (
		<div className="neliosr-quota-meter__bar-container">
			<TransitionGroup>
				<CSSTransition
					classNames="neliosr-quota-meter--animation"
					appear={ true }
					enter={ false }
					exit={ false }
					timeout={ 2500 }
				>
					<span
						className={ classnames(
							'neliosr-quota-meter__bar',
							`neliosr-quota-meter__bar--width-${ size }`,
							{ 'neliosr-quota-meter__bar--disabled': disabled }
						) }
					></span>
				</CSSTransition>
			</TransitionGroup>
		</div>
	);
};

// =====
// HOOKS
// =====

const useQuota = ( subscriptionQuota: Maybe< Quota > ) =>
	useSelect(
		(
			select
		): { quota: Maybe< Quota >; status: 'ready' | 'loading' | 'error' } => {
			select( STORE_NAME );
			if ( subscriptionQuota ) {
				return { quota: subscriptionQuota, status: 'ready' };
			} //end if

			/* eslint-disable @wordpress/no-unused-vars-before-return */
			const quota = select( STORE_NAME ).getQuota();
			const isLoading =
				! select( STORE_NAME ).hasFinishedResolution( 'getQuota' );
			const isError =
				select( STORE_NAME ).hasResolutionFailed( 'getQuota' );
			/* eslint-enable @wordpress/no-unused-vars-before-return */

			if ( isLoading ) {
				return { quota: undefined, status: 'loading' };
			} //end if

			if ( isError || ! quota ) {
				return { quota: undefined, status: 'error' };
			} //end if

			return { quota, status: 'ready' };
		}
	);
