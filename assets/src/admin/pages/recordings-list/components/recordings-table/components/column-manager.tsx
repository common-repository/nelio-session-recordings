/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, CheckboxControl, Popover } from '@safe-wordpress/components';
import { useState } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { Icon } from '@neliosr/components';

export const ColumnManager = ( {
	columns,
	hiddenColumns,
	setHiddenColumns,
}: {
	columns: ReadonlyArray< { readonly key: string; readonly label: string } >;
	hiddenColumns: ReadonlyArray< string >;
	setHiddenColumns: ( hiddenColumns: ReadonlyArray< string > ) => void;
} ): JSX.Element => {
	const [ isVisible, setIsVisible ] = useState( false );
	const toggleVisible = () => {
		setIsVisible( ( state ) => ! state );
	};

	const toggleColumn = ( columnKey: string ) => {
		if ( hiddenColumns.includes( columnKey ) ) {
			setHiddenColumns(
				hiddenColumns.filter( ( v ) => v !== columnKey )
			);
		} else {
			setHiddenColumns( hiddenColumns.concat( columnKey ) );
		} //end if
	};

	return (
		<Button
			icon={ <Icon icon="columns" /> }
			label={ _x( 'Manage Columns', 'user', 'nelio-session-recordings' ) }
			showTooltip
			onClick={ toggleVisible }
		>
			{ isVisible && (
				<Popover
					className="neliosr-column-manager"
					focusOnMount={ false }
				>
					{ columns.map( ( { key, label } ) => (
						<CheckboxControl
							key={ key }
							label={ label }
							checked={ ! hiddenColumns.includes( key ) }
							onChange={ () => {
								toggleColumn( key );
								setIsVisible( true );
							} }
						/>
					) ) }
				</Popover>
			) }
		</Button>
	);
};
