/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button } from '@safe-wordpress/components';
import { useDispatch } from '@safe-wordpress/data';
import { useState } from '@safe-wordpress/element';
import { _x, _nx, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import type { Select } from '@table-library/react-table-library/select';
import type { TableNode } from '@table-library/react-table-library/types/table';
import { ConfirmationDialog, Icon } from '@neliosr/components';
import { STORE_NAME } from '@neliosr/data';
import type { SessionRecording } from '@neliosr/types';

type RemoveActionProps = {
	readonly selectedRecordings: ReadonlyArray< SessionRecording[ 'id' ] >;
	readonly select: Select< TableNode >;
	readonly isDisabled: boolean;
};
export const RemoveAction = ( {
	selectedRecordings,
	select,
	isDisabled,
}: RemoveActionProps ): JSX.Element => {
	const [ isVisible, setVisible ] = useState( false );
	const [ isLoading, setIsLoading ] = useState( false );
	const { removeRecordings } = useDispatch( STORE_NAME );
	return (
		<>
			<Button
				icon={ <Icon icon="trash" /> }
				disabled={ isDisabled || ! selectedRecordings.length }
				label={
					! selectedRecordings.length
						? _x(
								'Select recordings first to delete them',
								'user',
								'nelio-session-recordings'
						  )
						: sprintf(
								/* translators: number of session recordings */
								_nx(
									'Remove %d recording',
									'Remove %d recordings',
									selectedRecordings.length,
									'user',
									'nelio-session-recordings'
								),
								selectedRecordings.length
						  )
				}
				showTooltip
				onClick={ () => setVisible( true ) }
			></Button>

			<ConfirmationDialog
				title={ sprintf(
					/* translators: number of session recordings */
					_nx(
						'Remove %d recording',
						'Remove %d recordings',
						selectedRecordings.length,
						'user',
						'nelio-session-recordings'
					),
					selectedRecordings.length
				) }
				text={ _x(
					'This action will remove the selected recordings. This action cannot be undone. Do you want to continue?',
					'user',
					'nelio-session-recordings'
				) }
				confirmLabel={
					isLoading
						? _x(
								'Removing',
								'command (remove recording)',
								'nelio-session-recordings'
						  )
						: _x(
								'Remove',
								'command (remove recording)',
								'nelio-session-recordings'
						  )
				}
				isDestructive
				isConfirmBusy={ isLoading }
				onCancel={ () => setVisible( false ) }
				onConfirm={ () => {
					setIsLoading( true );
					void removeRecordings( selectedRecordings ).finally( () => {
						select.fns.onToggleAll( {} );
						setIsLoading( false );
						setVisible( false );
					} );
				} }
				isOpen={ isVisible }
			/>
		</>
	);
};
