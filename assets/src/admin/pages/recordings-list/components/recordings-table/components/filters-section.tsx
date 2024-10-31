/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, Dropdown } from '@safe-wordpress/components';
import { applyFilters } from '@safe-wordpress/hooks';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { keyBy } from 'lodash';

/**
 * Internal dependencies
 */
import FILTER_CATEGORIES from './filter-manager/filter-categories';
import type {
	Filter,
	FilterComponentType,
	FilterDescriptionComponentType,
	Settings,
} from '../../../types';

type FiltersSectionProps = {
	readonly settings: Settings;
	readonly filters: ReadonlyArray< Filter >;
	readonly setFilters: ( value: ReadonlyArray< Filter > ) => void;
};
export const FiltersSection = ( props: FiltersSectionProps ): JSX.Element => {
	const { settings, filters, setFilters } = props;

	return (
		<div className="neliosr-filter-section">
			{ filters.map( ( filter, key ) => (
				<Dropdown
					key={ key }
					className="neliosr-filter-section__filter"
					renderToggle={ ( { isOpen, onToggle } ) => {
						const FilterDescription = applyFilters(
							`neliosr.get_${ filter.type }_filter_overview_description`,
							() => null
						) as FilterDescriptionComponentType< Filter > | string;
						return (
							<Button
								className="neliosr-filter-section__filter-description"
								icon={ FILTERS_BY_TYPE[ filter.type ]?.icon }
								disabled={
									filter.type === 'ab-testing' &&
									settings.isStandalone
								}
								onClick={ onToggle }
								aria-expanded={ isOpen }
								variant="secondary"
							>
								{ typeof FilterDescription === 'string' ? (
									<span>{ FilterDescription }</span>
								) : (
									<FilterDescription
										settings={ settings }
										filter={ filter }
									/>
								) }
							</Button>
						);
					} }
					renderContent={ ( { onClose } ) => {
						const FilterComponent = applyFilters(
							`neliosr.get_${ filter.type }_filter_component`,
							() => null
						) as FilterComponentType< Filter >;
						return (
							<div
								className={ `neliosr-filter-section__filter-container neliosr-filter-${ filter.type }` }
							>
								<div className="neliosr-filter-section__filter-settings">
									<FilterComponent
										settings={ settings }
										filter={ filter }
										onChange={ ( changedFilter ) => {
											setFilters(
												[ ...filters ].map( ( f, i ) =>
													i === key
														? changedFilter
														: f
												)
											);
										} }
									/>
								</div>
								<div className="neliosr-filter-section__filter-actions">
									<Button
										onClick={ () => {
											const updatedFilters = [
												...filters,
											];
											updatedFilters.splice( key, 1 );
											setFilters( updatedFilters );
											onClose();
										} }
										variant="link"
										isDestructive
									>
										{ _x(
											'Remove filter',
											'command',
											'nelio-session-recordings'
										) }
									</Button>
								</div>
							</div>
						);
					} }
				/>
			) ) }
		</div>
	);
};

const FILTERS_BY_TYPE = keyBy(
	FILTER_CATEGORIES.map( ( fc ) => fc.filters ).flat(),
	'type'
);
