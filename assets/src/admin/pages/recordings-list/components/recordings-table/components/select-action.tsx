/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button } from '@safe-wordpress/components';
import { _nx, _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import type { Select } from '@table-library/react-table-library/select';
import type { TableNode } from '@table-library/react-table-library/types/table';
import type { SessionRecording } from '@neliosr/types';

type SelectActionProps = {
	readonly selectedRows: ReadonlyArray< SessionRecording[ 'id' ] >;
	readonly recordings: ReadonlyArray< SessionRecording >;
	readonly select: Select< TableNode >;
};
export const SelectAction = (
	props: SelectActionProps
): JSX.Element | null => {
	const { selectedRows, recordings, select } = props;

	if ( ! selectedRows.length ) {
		return null;
	} //end if

	return (
		<div className="neliosr-table-actions__selection">
			<span>
				{ sprintf(
					/* translators: number of selected rows */
					_nx(
						'%d recording selected',
						'%d recordings selected',
						selectedRows.length,
						'text',
						'nelio-session-recordings'
					),
					selectedRows.length
				) }
			</span>
			{ selectedRows.length !== recordings.length ? (
				<Button
					isSmall
					variant="secondary"
					onClick={ () =>
						select.fns.onToggleAll( {
							isCarryForward: true,
							isPartialToAll: true,
						} )
					}
				>
					{ sprintf(
						/* translators: number of rows */
						_nx(
							'Select all %d recording',
							'Select all %d recordings',
							recordings.length,
							'user',
							'nelio-session-recordings'
						),
						recordings.length
					) }
				</Button>
			) : (
				<Button
					isSmall
					variant="secondary"
					onClick={ () => select.fns.onToggleAll( {} ) }
				>
					{ _x(
						'Clear selection',
						'user',
						'nelio-session-recordings'
					) }
				</Button>
			) }
		</div>
	);
};
