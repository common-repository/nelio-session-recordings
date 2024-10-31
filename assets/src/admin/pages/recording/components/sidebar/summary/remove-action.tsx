/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button } from '@safe-wordpress/components';
import { useDispatch } from '@safe-wordpress/data';
import { useState } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { ConfirmationDialog } from '@neliosr/components';
import { STORE_NAME, useAdminUrl } from '@neliosr/data';
import type { SessionRecording } from '@neliosr/types';

type RemoveActionProps = {
	readonly id: SessionRecording[ 'id' ];
};
export const RemoveAction = ( { id }: RemoveActionProps ): JSX.Element => {
	const [ isVisible, setVisible ] = useState( false );
	const [ isLoading, setIsLoading ] = useState( false );
	const { removeRecordings } = useDispatch( STORE_NAME );
	const recordingsUrl = useAdminUrl( 'admin.php', {
		page: 'nelio-session-recordings',
	} );

	return (
		<>
			<Button
				className="neliosr-remove-action"
				variant="secondary"
				isDestructive
				showTooltip
				onClick={ () => setVisible( true ) }
			>
				{ _x(
					'Remove recording',
					'command',
					'nelio-session-recordings'
				) }
			</Button>

			<ConfirmationDialog
				title={ _x(
					'Remove recording',
					'command',
					'nelio-session-recordings'
				) }
				text={ _x(
					'This action will remove the recording. This action cannot be undone. Do you want to continue?',
					'user',
					'nelio-session-recordings'
				) }
				confirmLabel={
					isLoading
						? _x(
								'Removing…',
								'text (remove recording)',
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
					void removeRecordings( [ id ] ).finally( () => {
						setIsLoading( false );
						setVisible( false );
						window.location.href = recordingsUrl;
					} );
				} }
				isOpen={ isVisible }
			/>
		</>
	);
};
