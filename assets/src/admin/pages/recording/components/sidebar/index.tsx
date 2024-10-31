/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button } from '@safe-wordpress/components';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { usePageAttribute } from '@neliosr/data';

/**
 * Internal dependencies
 */
import './style.scss';
import { ActionList } from './action-list';
import { Summary } from './summary';

export const Sidebar = (): JSX.Element => {
	const [ isOpen, setOpen ] = usePageAttribute(
		'recording/isSidebarOpen',
		false
	);
	return (
		<>
			<Button
				icon={ isOpen ? 'no' : 'arrow-left-alt2' }
				className={ classnames( 'neliosr-recording-sidebar__toggle', {
					'neliosr-recording-sidebar__toggle--sidebar-closed':
						! isOpen,
				} ) }
				onClick={ () => setOpen( ! isOpen ) }
			/>
			<div
				className={ classnames( 'neliosr-recording-sidebar', {
					'neliosr-recording-sidebar--closed': ! isOpen,
				} ) }
			>
				<div className="neliosr-recording-sidebar__element-wrapper">
					<Summary />
					<ActionList />
				</div>
			</div>
		</>
	);
};
