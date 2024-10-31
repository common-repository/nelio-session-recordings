/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, CheckboxControl, Spinner } from '@safe-wordpress/components';
import { useSelect } from '@safe-wordpress/data';
import { useState } from '@safe-wordpress/element';
import { applyFilters } from '@safe-wordpress/hooks';
import { _nx, _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { CompactTable } from '@table-library/react-table-library/compact';
import { useTheme } from '@table-library/react-table-library/theme';
import {
	DEFAULT_OPTIONS,
	getTheme,
} from '@table-library/react-table-library/material-ui';
import { usePagination } from '@table-library/react-table-library/pagination';
import {
	SelectClickTypes,
	useRowSelect,
} from '@table-library/react-table-library/select';
import { useSort } from '@table-library/react-table-library/sort';
import {
	Browser,
	CountryFlag,
	Device,
	Icon,
	LoadingAnimation,
	OperatingSystem,
	PageUrl,
	Tooltip,
} from '@neliosr/components';
import { STORE_NAME, useAdminUrl } from '@neliosr/data';
import { formatDuration, formatI18nDatetime } from '@neliosr/date';
import {
	FIRST_PAGE,
	ROWS_PER_PAGE_OPTIONS,
	getCountryName,
	getValue,
	maybeFixId,
	setValue,
} from '@neliosr/utils';
import type { Column } from '@table-library/react-table-library/compact';
import type { Pagination as PaginationType } from '@table-library/react-table-library/pagination';
import type { Select } from '@table-library/react-table-library/select';
import type { Sort } from '@table-library/react-table-library/sort';
import type {
	Data,
	TableNode,
} from '@table-library/react-table-library/types/table';
import type { SessionRecording } from '@neliosr/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { ColumnManager } from './components/column-manager';
import { DownloadCsvAction } from './components/download-csv-action';
import { RemoveAction } from './components/remove-action';
import { Pagination } from './components/pagination';
import { SelectAction } from './components/select-action';
import { FilterManager } from './components/filter-manager';
import { FiltersSection } from './components/filters-section';

import type { Filter, Settings } from '../../types';

export const RecordingsTable = ( {
	settings,
}: {
	settings: Settings;
} ): JSX.Element => {
	const activeRecordings = useActiveRecordings();
	const { items: recordings, isLoading } = useRecordings();

	const data = { nodes: recordings as Array< SessionRecording > };

	const [ hiddenColumns, setHiddenColumns ] = useState<
		ReadonlyArray< string >
	>( getValue< ReadonlyArray< string > >( 'hidden-columns', [] ) || [] );

	const [ selectedRows, setSelectedRows ] = useState<
		ReadonlyArray< SessionRecording[ 'id' ] >
	>( [] );
	const [ filters, setFilters ] = useState< ReadonlyArray< Filter > >(
		getValue< ReadonlyArray< Filter > >( 'filters' ) || []
	);

	const filteredData = {
		...data,
		nodes: data.nodes.filter( ( recording ) =>
			filters.every( ( filter ) =>
				applyFilters(
					`neliosr.apply_${ filter.type }_filter`,
					true,
					recording,
					filter,
					settings
				)
			)
		),
	};

	const pagination = usePagination( filteredData, {
		state: {
			page: FIRST_PAGE,
			size: ROWS_PER_PAGE_OPTIONS[ 0 ],
		},
	} );
	const sort = useSortSettings( filteredData );
	const select = useSelectSettings( filteredData, setSelectedRows );
	const columns = useColumnsSettings(
		hiddenColumns,
		select,
		sort,
		pagination,
		filteredData.nodes
	);

	const theme = useThemeSettings( hiddenColumns );

	if ( ! activeRecordings && ! data.nodes.length ) {
		return (
			<div className="neliosr-active-recordings--none">
				{ _x(
					'No session was recorded yet…',
					'text',
					'nelio-session-recordings'
				) }
			</div>
		);
	} //end if

	const isShowingExamples = data.nodes.every( ( n ) => n.isExample );

	const columnsToManage = (
		columns.filter(
			( c ) => !! c.key && !! c.textLabel
		) as ReadonlyArray< {
			readonly key: string;
			readonly textLabel: string;
		} >
	 ).map( ( { key, textLabel } ) => ( { key, label: textLabel } ) );

	return (
		<>
			<div className="neliosr-table-header">
				<div className="neliosr-active-recordings">
					{ !! activeRecordings ? (
						<>
							<Spinner />
							<p>
								{ isShowingExamples
									? sprintf(
											/* translators: number of active sessions */
											_nx(
												'There is %d session being recorded right now. Once finished, you’ll see the details below. In the meantime, see some examples:',
												'There are %d sessions being recorded right now. Once finished, you’ll see the details below. In the meantime, see some examples:',
												activeRecordings,
												'user',
												'nelio-session-recordings'
											),
											activeRecordings
									  )
									: sprintf(
											/* translators: number of active sessions */
											_nx(
												'There is %d session being recorded right now. Once finished, you’ll see the details below.',
												'There are %d sessions being recorded right now. Once finished, you’ll see the details below.',
												activeRecordings,
												'user',
												'nelio-session-recordings'
											),
											activeRecordings
									  ) }
							</p>
						</>
					) : (
						<p>
							{ isShowingExamples &&
								_x(
									'See some examples of session recordings from our site:',
									'user',
									'nelio-session-recordings'
								) }
						</p>
					) }
				</div>
				{ !! data.nodes.length && (
					<div className="neliosr-table-actions">
						<SelectAction
							selectedRows={ selectedRows }
							recordings={ filteredData.nodes }
							select={ select }
						/>
						<RemoveAction
							selectedRecordings={ selectedRows }
							select={ select }
							isDisabled={ isShowingExamples }
						/>
						<ColumnManager
							columns={ columnsToManage }
							hiddenColumns={ hiddenColumns }
							setHiddenColumns={ ( hidden ) => {
								setHiddenColumns( hidden );
								setValue( 'hidden-columns', hidden );
							} }
						/>
						<FilterManager
							settings={ settings }
							filters={ filters }
							setFilters={ ( updatedfilters ) => {
								setFilters( updatedfilters );
								setValue( 'filters', updatedfilters );
							} }
						/>
						<DownloadCsvAction data={ filteredData } />
					</div>
				) }
			</div>
			{ !! data.nodes.length ? (
				<>
					{ filters.length > 0 && (
						<FiltersSection
							settings={ settings }
							filters={ filters }
							setFilters={ ( updatedfilters ) => {
								setFilters( updatedfilters );
								setValue( 'filters', updatedfilters );
							} }
						/>
					) }
					<CompactTable
						columns={ columns }
						data={ filteredData }
						pagination={ pagination }
						select={ select }
						sort={ sort }
						layout={ { custom: true, horizontalScroll: false } }
						theme={ theme }
					/>
					<Pagination
						count={ filteredData.nodes.length }
						page={ pagination.state.page as number }
						rowsPerPage={ pagination.state.size as number }
						rowsPerPageOptions={ ROWS_PER_PAGE_OPTIONS }
						isLoading={ isLoading }
						onRowsPerPageChange={ pagination.fns.onSetSize }
						onPageChange={ pagination.fns.onSetPage }
					/>
				</>
			) : (
				<LoadingAnimation
					text={ _x(
						'Recording…',
						'text',
						'nelio-session-recordings'
					) }
				/>
			) }
		</>
	);
};

// =====
// HOOKS
// =====

const useActiveRecordings = () =>
	useSelect( ( select ) => select( STORE_NAME ).getActiveRecordings() );

const useRecordings = () =>
	useSelect( ( select ) => ( {
		items: select( STORE_NAME ).getRecordings() || [],
		isLoading: ! select( STORE_NAME ).areAllRecordingsLoaded(),
	} ) );

const useThemeSettings = ( hiddenColumns: ReadonlyArray< string > ) => {
	const materialTheme = getTheme( {
		...DEFAULT_OPTIONS,
		striped: true,
		highlightOnHover: true,
	} );
	const customTheme = {
		Table: `
			--data-table-library_grid-template-columns: 50px fit-content(300px) ${ getColumnSizes(
				hiddenColumns
			) } !important;
			border-radius: 5px;
			box-shadow: 0 2px 10px 0 rgba(0, 0, 40, 0.07);
			margin: 16px 0px;
			overflow-y: hidden;
		`,
		BaseCell: `
			max-height: 4em;
			&:nth-of-type(2) {
				border-right: 1px solid #e0e0e0;
			}
		`,
	};
	return useTheme( [ materialTheme, customTheme ] );
};

const getColumnSizes = ( hiddenColumns: ReadonlyArray< string > ): string => {
	const sizes: Record< string, string > = {
		ID: 'minmax(0, 1fr)',
		DATE: 'minmax(0, 2fr)',
		PAGES: 'minmax(0, 1fr)',
		ACTIONS: 'minmax(0, 1fr)',
		CLICKS: 'minmax(0, 1fr)',
		DURATION: 'minmax(0, 1fr)',
		COUNTRY: 'minmax(0, 1fr)',
		BROWSER: 'minmax(0, 1fr)',
		OS: 'minmax(0, 1fr)',
		DEVICE: 'minmax(0, 1fr)',
		LANDING: 'minmax(0, 3fr)',
		EXIT: 'minmax(0, 3fr)',
	};
	return Object.keys( sizes )
		.filter( ( key ) => ! hiddenColumns.includes( key ) )
		.map( ( key ) => sizes[ key ] )
		.join( ' ' );
};

const useSelectSettings = (
	data: Data< TableNode >,
	setState: ( state: ReadonlyArray< SessionRecording[ 'id' ] > ) => void
) =>
	useRowSelect(
		data,
		{
			onChange: ( _: unknown, state: unknown ) => {
				setState(
					(
						state as {
							ids: ReadonlyArray< SessionRecording[ 'id' ] >;
						}
					 ).ids.filter(
						( value, index, array ) =>
							array.indexOf( value ) === index
					)
				);
			},
		},
		{ clickType: SelectClickTypes.ButtonClick }
	);

const useSortSettings = ( data: Data< TableNode > ) =>
	useSort(
		data,
		{
			state: {
				sortKey: 'DATE',
			},
		},
		{
			sortIcon: {
				iconDefault: null,
				iconUp: <Icon icon="chevronUp" />,
				iconDown: <Icon icon="chevronDown" />,
			},
			sortFns: {
				ID: ( array ) =>
					array.sort( ( a, b ) =>
						( b as SessionRecording ).id.localeCompare(
							( a as SessionRecording ).id
						)
					),
				DATE: ( array ) =>
					array.sort( ( a, b ) =>
						( b as SessionRecording ).first.localeCompare(
							( a as SessionRecording ).first
						)
					),
				PAGES: ( array ) =>
					array.sort(
						( a, b ) =>
							( b as SessionRecording ).pages.length -
							( a as SessionRecording ).pages.length
					),
				ACTIONS: ( array ) =>
					array.sort(
						( a, b ) => b.numberOfActions - a.numberOfActions
					),
				CLICKS: ( array ) =>
					array.sort(
						( a, b ) => b.numberOfClicks - a.numberOfClicks
					),
				DURATION: ( array ) =>
					array.sort( ( a, b ) => b.duration - a.duration ),
				COUNTRY: ( array ) =>
					array.sort( ( a, b ) =>
						( b as SessionRecording ).country.localeCompare(
							( a as SessionRecording ).country
						)
					),
				BROWSER: ( array ) =>
					array.sort( ( a, b ) =>
						( b as SessionRecording ).browser.localeCompare(
							( a as SessionRecording ).browser
						)
					),
				OS: ( array ) =>
					array.sort( ( a, b ) =>
						( b as SessionRecording ).os.localeCompare(
							( a as SessionRecording ).os
						)
					),
				DEVICE: ( array ) =>
					array.sort( ( a, b ) =>
						( b as SessionRecording ).device.localeCompare(
							( a as SessionRecording ).device
						)
					),
				LANDING: ( array ) =>
					array.sort( ( a, b ) =>
						(
							( b as SessionRecording ).landing || ''
						).localeCompare(
							( a as SessionRecording ).landing || ''
						)
					),
				EXIT: ( array ) =>
					array.sort( ( a, b ) =>
						( ( b as SessionRecording ).exit || '' ).localeCompare(
							( a as SessionRecording ).exit || ''
						)
					),
			},
		}
	);

const useColumnsSettings = (
	hiddenColumns: ReadonlyArray< string >,
	select: Select< TableNode >,
	sort: Sort< TableNode >,
	pagination: PaginationType< SessionRecording >,
	nodes: ReadonlyArray< SessionRecording >
): ReadonlyArray<
	Omit< Column< TableNode >, 'label' > & {
		readonly key?: string;
		readonly label?: JSX.Element | string;
		readonly textLabel?: string;
	}
> => {
	const PlayButton = ( {
		id,
		isExample,
	}: {
		readonly id: string;
		readonly isExample: boolean;
	} ): JSX.Element => {
		const url = useAdminUrl( 'admin.php', {
			page: 'nelio-session-recordings-viewer',
			recording: id,
		} );
		return (
			<Button variant="primary" href={ url }>
				<Icon icon="play" />
				<span style={ { marginLeft: '5px' } }>
					{ isExample
						? _x(
								'See Example',
								'command',
								'nelio-session-recordings'
						  )
						: _x( 'Play', 'command', 'nelio-session-recordings' ) }
				</span>
			</Button>
		);
	};

	return [
		{
			label: '',
			select: {
				renderHeaderCellSelect: () => {
					const page = pagination.state.page as number;
					const rowsPerPage = pagination.state.size as number;
					const sortFunction =
						sort.options.sortFns[ sort.state.sortKey as string ];
					const rowIdsOfCurrentPage: Array<
						SessionRecording[ 'id' ]
					> = (
						sortFunction
							? ( sortFunction( [
									...nodes,
							  ] ) as Array< SessionRecording > )
							: []
					)

						.slice( page * rowsPerPage, ( page + 1 ) * rowsPerPage )
						.map( ( n ) => n.id );
					const checked =
						!! rowIdsOfCurrentPage.length &&
						rowIdsOfCurrentPage.every( ( rid ) =>
							(
								select.state.ids as Array<
									SessionRecording[ 'id' ]
								>
							 ).includes( rid )
						);
					return (
						<CheckboxControl
							className="neliosr-table-row-selector"
							checked={ checked }
							onChange={ ( isChecked ) =>
								isChecked
									? select.fns.onAddByIds(
											rowIdsOfCurrentPage,
											{
												isCarryForward: true,
												isPartialToAll: true,
											}
									  )
									: select.fns.onRemoveByIds(
											rowIdsOfCurrentPage
									  )
							}
						/>
					);
				},
				renderCellSelect: ( item ) => (
					<CheckboxControl
						className="neliosr-table-row-selector"
						checked={ (
							select.state.ids as Array<
								SessionRecording[ 'id' ]
							>
						 ).includes( ( item as SessionRecording ).id ) }
						onChange={ () =>
							select.fns.onToggleById(
								( item as SessionRecording ).id
							)
						}
					/>
				),
			},
			pinLeft: true,
			renderCell: ( item ) => (
				<PlayButton
					id={ ( item as SessionRecording ).id }
					isExample={ !! ( item as SessionRecording ).isExample }
				/>
			),
		},
		{
			key: 'ID',
			textLabel: _x( 'ID', 'text', 'nelio-session-recordings' ),
			label: _x( 'ID', 'text', 'nelio-session-recordings' ),
			sort: { sortKey: 'ID' },
			hide: hiddenColumns.includes( 'ID' ),
			renderCell: ( item ) => {
				const id = maybeFixId( ( item as SessionRecording ).id );
				return (
					<Tooltip text={ id }>
						<div className="neliosr-ellipsis">{ id }</div>
					</Tooltip>
				);
			},
		},
		{
			key: 'DATE',
			label: _x( 'Date', 'text', 'nelio-session-recordings' ),
			textLabel: _x( 'Date', 'text', 'nelio-session-recordings' ),
			sort: { sortKey: 'DATE' },
			hide: hiddenColumns.includes( 'DATE' ),
			renderCell: ( item ) =>
				formatI18nDatetime( ( item as SessionRecording ).first ),
		},
		{
			key: 'PAGES',
			label: _x( '# Pages', 'text', 'nelio-session-recordings' ),
			textLabel: _x( '# Pages', 'text', 'nelio-session-recordings' ),
			sort: { sortKey: 'PAGES' },
			hide: hiddenColumns.includes( 'PAGES' ),
			renderCell: ( item ) =>
				( item as SessionRecording ).pages.length || '',
		},
		{
			key: 'ACTIONS',
			label: _x( '# Actions', 'text', 'nelio-session-recordings' ),
			textLabel: _x( '# Actions', 'text', 'nelio-session-recordings' ),
			sort: { sortKey: 'ACTIONS' },
			hide: hiddenColumns.includes( 'ACTIONS' ),
			renderCell: ( item ) =>
				( item as SessionRecording ).numberOfActions,
		},
		{
			key: 'CLICKS',
			label: _x( '# Clicks', 'text', 'nelio-session-recordings' ),
			textLabel: _x( '# Clicks', 'text', 'nelio-session-recordings' ),
			sort: { sortKey: 'CLICKS' },
			hide: hiddenColumns.includes( 'CLICKS' ),
			renderCell: ( item ) => ( item as SessionRecording ).numberOfClicks,
		},
		{
			key: 'DURATION',
			label: _x( 'Duration', 'text', 'nelio-session-recordings' ),
			textLabel: _x( 'Duration', 'text', 'nelio-session-recordings' ),
			sort: { sortKey: 'DURATION' },
			hide: hiddenColumns.includes( 'DURATION' ),
			renderCell: ( item ) =>
				formatDuration(
					( item as SessionRecording ).duration,
					'seconds'
				),
		},
		{
			key: 'COUNTRY',
			label: _x( 'Country', 'text', 'nelio-session-recordings' ),
			textLabel: _x( 'Country', 'text', 'nelio-session-recordings' ),
			sort: { sortKey: 'COUNTRY' },
			hide: hiddenColumns.includes( 'COUNTRY' ),
			renderCell: ( item ) => (
				<CountryFlag
					country={ ( item as SessionRecording ).country }
					tooltip={ getCountryName(
						( item as SessionRecording ).country.toUpperCase()
					) }
				/>
			),
		},
		{
			key: 'BROWSER',
			label: (
				<Icon
					icon="web"
					tooltip={ _x(
						'Browser',
						'text',
						'nelio-session-recordings'
					) }
				/>
			),
			textLabel: _x( 'Browser', 'text', 'nelio-session-recordings' ),
			sort: { sortKey: 'BROWSER' },
			hide: hiddenColumns.includes( 'BROWSER' ),
			renderCell: ( item ) => (
				<Browser type={ ( item as SessionRecording ).browser } />
			),
		},
		{
			key: 'OS',
			label: (
				<Tooltip
					text={ _x(
						'Operating System',
						'text',
						'nelio-session-recordings'
					) }
				>
					<div style={ { width: 'min-content' } }>
						{ _x( 'OS', 'text', 'nelio-session-recordings' ) }
					</div>
				</Tooltip>
			),
			textLabel: _x(
				'Operating System',
				'text',
				'nelio-session-recordings'
			),
			sort: { sortKey: 'OS' },
			hide: hiddenColumns.includes( 'OS' ),
			renderCell: ( item ) => (
				<OperatingSystem type={ ( item as SessionRecording ).os } />
			),
		},
		{
			key: 'DEVICE',
			label: (
				<Icon
					icon="monitorCellphone"
					tooltip={ _x(
						'Device',
						'text',
						'nelio-session-recordings'
					) }
				/>
			),
			textLabel: _x( 'Device', 'text', 'nelio-session-recordings' ),
			sort: { sortKey: 'DEVICE' },
			hide: hiddenColumns.includes( 'DEVICE' ),
			renderCell: ( item ) => (
				<Device type={ ( item as SessionRecording ).device } />
			),
		},
		{
			key: 'LANDING',
			label: _x( 'Landing Page', 'text', 'nelio-session-recordings' ),
			textLabel: _x( 'Landing Page', 'text', 'nelio-session-recordings' ),
			sort: { sortKey: 'LANDING' },
			hide: hiddenColumns.includes( 'LANDING' ),
			renderCell: ( item ) => (
				<PageUrl
					url={ ( item as SessionRecording ).landing || '' }
					isLink
				/>
			),
		},
		{
			key: 'EXIT',
			label: _x( 'Exit Page', 'text', 'nelio-session-recordings' ),
			textLabel: _x( 'Exit Page', 'text', 'nelio-session-recordings' ),
			sort: { sortKey: 'EXIT' },
			hide: hiddenColumns.includes( 'EXIT' ),
			renderCell: ( item ) => (
				<PageUrl
					url={ ( item as SessionRecording ).exit || '' }
					isLink
				/>
			),
		},
	];
};
