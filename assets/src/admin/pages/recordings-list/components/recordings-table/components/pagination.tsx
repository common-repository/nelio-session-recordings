/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useEffect } from '@safe-wordpress/element';
import { Button, SelectControl } from '@safe-wordpress/components';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { Icon } from '@neliosr/components';

type PaginationProps = {
	readonly count: number;
	readonly page: number;
	readonly rowsPerPage: number;
	readonly rowsPerPageOptions: ReadonlyArray< number >;
	readonly isLoading: boolean;
	readonly onRowsPerPageChange: ( value: number ) => void;
	readonly onPageChange: ( value: number ) => void;
};
export const Pagination = ( props: PaginationProps ): JSX.Element => {
	const {
		count,
		page,
		rowsPerPage,
		rowsPerPageOptions,
		isLoading,
		onPageChange,
		onRowsPerPageChange,
	} = props;

	useEffect( () => {
		if ( page === 0 ) {
			return;
		} //end if

		const isCurrentPageActive = hasNextPage( {
			count,
			page: page - 1,
			rowsPerPage,
			isLoading,
		} );
		if ( ! isCurrentPageActive ) {
			onPageChange( page - 1 );
		} //end if
	}, [ count, page, rowsPerPage, isLoading ] );

	const displayedRowsLabel = defaultLabelDisplayedRows( {
		from: page * rowsPerPage + 1,
		to: Math.min( count, ( page + 1 ) * rowsPerPage ),
		count,
		isLoading,
	} );

	return (
		<div className="neliosr-table-pagination-container">
			{ rowsPerPageOptions.length > 1 && (
				<SelectControl
					className="neliosr-table-pagination__rows-per-page"
					label={ _x(
						'Rows per page:',
						'text',
						'nelio-session-recordings'
					) }
					value={ `${ rowsPerPage }` }
					options={ rowsPerPageOptions.map( ( value ) => ( {
						label: `${ value }`,
						value: `${ value }`,
					} ) ) }
					onChange={ ( newSize ) =>
						onRowsPerPageChange( parseInt( newSize ) )
					}
					{ ...{ labelPosition: 'side' } }
				/>
			) }
			<p className="neliosr-table-pagination__rows-label">
				{ displayedRowsLabel }
			</p>
			<div className="neliosr-table-pagination__actions">
				<Button
					className="neliosr-table-pagination__action-item"
					label={ _x(
						'Previous page',
						'text',
						'nelio-session-recordings'
					) }
					aria-current="false"
					disabled={ page === 0 }
					onClick={ () => onPageChange( page - 1 ) }
				>
					<Icon icon="chevronLeft" />
				</Button>
				<Button
					className="neliosr-table-pagination__action-item"
					label={ _x(
						'Next page',
						'text',
						'nelio-session-recordings'
					) }
					aria-current="false"
					onClick={ () => {
						onPageChange( page + 1 );
					} }
					disabled={
						! hasNextPage( {
							count,
							page,
							rowsPerPage,
							isLoading,
						} )
					}
				>
					<Icon icon="chevronRight" />
				</Button>
			</div>
		</div>
	);
};

const hasNextPage = ( {
	count,
	page,
	rowsPerPage,
	isLoading,
}: {
	count: number;
	page: number;
	rowsPerPage: number;
	isLoading: boolean;
} ): boolean =>
	isLoading
		? ( page + 2 ) * rowsPerPage <= count
		: ( page + 1 ) * rowsPerPage < count;

const defaultLabelDisplayedRows = ( {
	from,
	to,
	count,
	isLoading,
}: {
	from: number;
	to: number;
	count: number;
	isLoading: boolean;
} ) =>
	isLoading
		? sprintf(
				/* translators: 1 -> from, 2 -> to, 3 -> count */
				_x(
					'%1$s–%2$s of more than %3$s',
					'text',
					'nelio-session-recordings'
				),
				from,
				to,
				count
		  )
		: sprintf(
				/* translators: 1 -> from, 2 -> to, 3 -> count */
				_x( '%1$s–%2$s of %3$s', 'text', 'nelio-session-recordings' ),
				from,
				to,
				count
		  );
