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
import './style.scss';

export type LoadingAnimationProps = {
	readonly className?: string;
	readonly text?: string;
};

export const LoadingAnimation = ( {
	className,
	text,
}: LoadingAnimationProps ): JSX.Element => (
	<div className={ classnames( [ 'neliosr-loading-animation', className ] ) }>
		<div className="neliosr-loading-animation--container">
			<div className="neliosr-loading-animation__logo-container">
				<div className="neliosr-loading-animation__logo"></div>
			</div>
			{ !! text && (
				<p className="neliosr-loading-animation__text">{ text }</p>
			) }
		</div>
	</div>
);
