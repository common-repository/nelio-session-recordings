/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { Icon } from '@neliosr/components';
import type {
	Data,
	TableNode,
} from '@table-library/react-table-library/types/table';
import type { SessionRecording } from '@neliosr/types';

export const DownloadCsvAction = ( {
	data,
}: {
	data: Data< TableNode >;
} ): JSX.Element => {
	const handleDownload = useDownloadHandle( data );
	return (
		<Button
			icon={ <Icon icon="download" /> }
			label={ _x( 'Download CSV', 'user', 'nelio-session-recordings' ) }
			showTooltip
			onClick={ handleDownload }
		></Button>
	);
};

// =====
// HOOKS
// =====

const useDownloadHandle = ( data: Data< TableNode > ) => () => {
	const columns = [
		{
			accessor: ( item: SessionRecording ) => item.id,
			name: _x( 'ID', 'text', 'nelio-session-recordings' ),
		},
		{
			accessor: ( item: SessionRecording ) => item.first,
			name: _x(
				'Date of first event',
				'text',
				'nelio-session-recordings'
			),
		},
		{
			accessor: ( item: SessionRecording ) => item.last,
			name: _x(
				'Date of last event',
				'text',
				'nelio-session-recordings'
			),
		},
		{
			accessor: ( item: SessionRecording ) => item.duration,
			name: _x(
				'Duration in seconds',
				'text',
				'nelio-session-recordings'
			),
		},
		{
			accessor: ( item: SessionRecording ) => item.country,
			name: _x( 'Country', 'text', 'nelio-session-recordings' ),
		},
		{
			accessor: ( item: SessionRecording ) => item.browser,
			name: _x( 'Browser', 'text', 'nelio-session-recordings' ),
		},
		{
			accessor: ( item: SessionRecording ) => item.os,
			name: _x( 'OS', 'text', 'nelio-session-recordings' ),
		},
		{
			accessor: ( item: SessionRecording ) => item.device,
			name: _x( 'Device', 'text', 'nelio-session-recordings' ),
		},
		{
			accessor: ( item: SessionRecording ) => item.windowWidth,
			name: _x( 'Window Width', 'text', 'nelio-session-recordings' ),
		},
		{
			accessor: ( item: SessionRecording ) => item.windowHeight,
			name: _x( 'Window Height', 'text', 'nelio-session-recordings' ),
		},
		{
			accessor: ( item: SessionRecording ) => item.numberOfActions,
			name: _x( 'Number of Actions', 'text', 'nelio-session-recordings' ),
		},
		{
			accessor: ( item: SessionRecording ) => item.numberOfClicks,
			name: _x( 'Number of Clicks', 'text', 'nelio-session-recordings' ),
		},
		{
			accessor: ( item: SessionRecording ) => item.landing,
			name: _x( 'Landing Page', 'text', 'nelio-session-recordings' ),
		},
		{
			accessor: ( item: SessionRecording ) => item.exit,
			name: _x( 'Exit Page', 'text', 'nelio-session-recordings' ),
		},
		{
			accessor: ( item: SessionRecording ) => item.pages.join( ' ' ),
			name: _x( 'Visited Pages', 'text', 'nelio-session-recordings' ),
		},
	];

	downloadAsCsv(
		columns,
		data.nodes,
		_x( 'sessions.csv', 'text', 'nelio-session-recordings' )
	);
};

type ColumnAccessor = {
	readonly accessor: (
		item: SessionRecording
	) => string | number | undefined;
	readonly name: string;
};

const downloadAsCsv = (
	columns: Array< ColumnAccessor >,
	data: Array< TableNode >,
	filename: string
) => {
	const csvData = makeCsvData( columns, data );
	const csvFile = new Blob( [ csvData ], { type: 'text/csv' } );
	const downloadLink = document.createElement( 'a' );

	downloadLink.style.display = 'none';
	downloadLink.download = filename;
	downloadLink.href = window.URL.createObjectURL( csvFile );
	document.body.appendChild( downloadLink );
	downloadLink.click();
	document.body.removeChild( downloadLink );
};

const makeCsvData = (
	columns: Array< ColumnAccessor >,
	data: Array< TableNode >
) => {
	return data.reduce(
		( csvString, rowItem ) => {
			return (
				csvString +
				columns
					.map( ( { accessor } ) =>
						escapeCsvCell( accessor( rowItem as SessionRecording ) )
					)
					.join( ',' ) +
				'\r\n'
			);
		},
		columns.map( ( { name } ) => escapeCsvCell( name ) ).join( ',' ) +
			'\r\n'
	);
};

const escapeCsvCell = ( cell?: number | string ): string => {
	if ( cell === undefined ) {
		return '';
	} //end if
	const sc = cell.toString().trim();
	if ( sc === '' || sc === '""' ) {
		return sc;
	} //end if
	if (
		sc.includes( '"' ) ||
		sc.includes( ',' ) ||
		sc.includes( '\n' ) ||
		sc.includes( '\r' )
	) {
		return '"' + sc.replace( /"/g, '""' ) + '"';
	} //end if
	return sc;
};
