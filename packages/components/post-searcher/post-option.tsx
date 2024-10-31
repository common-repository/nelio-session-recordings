/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect } from '@safe-wordpress/data';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import type { OptionProps } from 'react-select';
import { STORE_NAME as NSR_DATA } from '@neliosr/data';
import { formatI18nDate } from '@neliosr/date';
import type { EntityInstance } from '@neliosr/types';

export type PostData = {
	readonly type: string;
	readonly value: number;
	readonly label: string;
};

export const PostOption = ( {
	data: { type, value },
	isFocused,
	isSelected,
	innerRef,
	innerProps,
}: OptionProps< PostData > ): JSX.Element => {
	const post = usePost( type, value ) as EntityInstance | undefined;
	const { authorName, date, thumbnailSrc, title, typeLabel } = post || {};

	return (
		<div
			ref={ innerRef }
			className={ classnames( {
				'neliosr-post-option-in-post-searcher': true,
				'neliosr-post-option-in-post-searcher--is-focused': isFocused,
				'neliosr-post-option-in-post-searcher--is-selected': isSelected,
			} ) }
			{ ...innerProps }
		>
			<div className="neliosr-post-option-in-post-searcher__image">
				<div
					className="neliosr-post-option-in-post-searcher__actual-image"
					style={ {
						backgroundImage: `url(${ thumbnailSrc || '' })`,
					} }
				></div>
			</div>

			<div className="neliosr-post-option-in-post-searcher__title">
				{ title }
			</div>

			<div className="neliosr-post-option-in-post-searcher__details">
				{ !! authorName
					? sprintf(
							/* translators: 1 -> post type name, 2 -> author name */
							_x(
								'%1$s by %2$s',
								'text',
								'nelio-session-recordings'
							),
							typeLabel,
							authorName
					  )
					: typeLabel }
				{ ` • ${ formatI18nDate( date || '' ) }` }
			</div>
		</div>
	);
};

// =====
// HOOKS
// =====

const usePost = ( type: string, id: number ) =>
	useSelect( ( select ) =>
		type === 'nab_experiment'
			? select( NSR_DATA ).getExperiment( `${ id }` || '0' )
			: select( NSR_DATA ).getEntityRecord( type, id )
	);
