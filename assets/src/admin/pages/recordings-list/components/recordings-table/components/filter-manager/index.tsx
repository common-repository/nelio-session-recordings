/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import {
	Button,
	Dropdown,
	MenuGroup,
	MenuItem,
} from '@safe-wordpress/components';
import { applyFilters } from '@safe-wordpress/hooks';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { Icon } from '@neliosr/components';
import type { Maybe } from '@neliosr/types';

/**
 * Internal dependencies
 */
import './style.scss';
import './filters';
import FILTER_CATEGORIES from './filter-categories';
import type { Filter, Settings } from '../../../../types';

type FilterManagerProps = {
	readonly settings: Settings;
	readonly filters: ReadonlyArray< Filter >;
	readonly setFilters: ( value: ReadonlyArray< Filter > ) => void;
};
export const FilterManager = ( props: FilterManagerProps ): JSX.Element => {
	const { settings, filters, setFilters } = props;

	return (
		<Dropdown
			className="neliosr-filter-manager"
			renderToggle={ ( { isOpen, onToggle } ) => (
				<Button
					className="neliosr-filter-manager__control"
					icon={ <Icon icon="filter" /> }
					label={ _x(
						'Apply Filters',
						'command',
						'nelio-session-recordings'
					) }
					showTooltip
					onClick={ onToggle }
					aria-expanded={ isOpen }
				>
					{ filters.length > 0 && (
						<span className="neliosr-filter-manager__control-count">
							{ filters.length }
						</span>
					) }
				</Button>
			) }
			renderContent={ ( { onClose } ) => (
				<MenuGroup>
					{ FILTER_CATEGORIES.map(
						( { category, filters: categoryFilters }, index ) => (
							<MenuGroup key={ index } label={ category }>
								{ categoryFilters.map(
									( { icon, label, type }, filterIndex ) => (
										<MenuItem
											key={ filterIndex }
											role="menuitem"
											disabled={
												filters.some(
													( f ) => f.type === type
												) ||
												( type === 'ab-testing' &&
													settings.isStandalone )
											}
											icon={ icon }
											onClick={ () => {
												setFilters(
													[
														...filters,
														applyFilters(
															`neliosr.get_default_${ type }_filter`,
															undefined
														) as Maybe< Filter >,
													].filter(
														( x ) => !! x
													) as ReadonlyArray< Filter >
												);
												onClose();
											} }
										>
											{ label }
										</MenuItem>
									)
								) }
							</MenuGroup>
						)
					) }
					<MenuGroup>
						<MenuItem
							role="menuitem"
							isDestructive
							disabled={ filters.length === 0 }
							icon="no-alt"
							onClick={ () => {
								setFilters( [] );
								onClose();
							} }
						>
							{ _x(
								'Remove all filters',
								'command',
								'nelio-session-recordings'
							) }
						</MenuItem>
					</MenuGroup>
				</MenuGroup>
			) }
		/>
	);
};
