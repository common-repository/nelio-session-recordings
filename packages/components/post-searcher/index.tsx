/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import apiFetch from '@safe-wordpress/api-fetch';
import { addQueryArgs } from '@safe-wordpress/url';
import { _x } from '@safe-wordpress/i18n';
import { useDispatch, useSelect } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { STORE_NAME as NSR_DATA } from '@neliosr/data';
import type {
	EntityInstance,
	Experiment,
	Maybe,
	PaginatedResults,
} from '@neliosr/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { PostOption } from './post-option';
import { TestOption } from './test-option';
import { AsyncSelectControl } from '../async-select-control';

export type PostSearcherProps = {
	readonly id?: string;
	readonly className?: string;
	readonly type?: string;
	readonly value: Maybe< number | string >;
	readonly onChange: ( val: Maybe< number > ) => void;
	readonly disabled?: boolean;
	readonly placeholder?: string;
} & Omit< OptionLoaderProps, 'type' >;

type OptionLoaderProps = {
	readonly type: string;
	readonly perPage?: number;
	readonly filter?: ( p: EntityInstance | Experiment ) => boolean;
};

export const PostSearcher = ( {
	id,
	className,
	disabled,
	onChange,
	placeholder: defaultPlaceholder,
	value,
	type = 'post',
	...loaderProps
}: PostSearcherProps ): JSX.Element => {
	const postId = numberify( value );
	const post = usePost( type, postId );
	const isLoading = useIsLoadingPost( type, postId );
	const placeholder = usePlaceholder(
		{ type, id: postId },
		defaultPlaceholder
	);

	const label = isTest( post ) ? post.name : post?.title;
	const selectedOption =
		! isLoading && postId
			? { type, value: postId, label: label ?? '' }
			: undefined;

	const loadOptions = useOptionLoader( { ...loaderProps, type } );

	return (
		<AsyncSelectControl
			id={ id }
			className={ classnames( [
				className,
				{
					'neliosr-post-searcher': true,
					'neliosr-post-searcher--is-loading': isLoading,
				},
			] ) }
			components={ {
				Option: type === 'nab_experiment' ? TestOption : PostOption,
			} }
			disabled={ disabled || isLoading }
			cacheUniqs={ [ type ] }
			loadOptions={ loadOptions }
			value={ selectedOption }
			onChange={ ( option ) =>
				onChange( Math.abs( option?.value ?? 0 ) || 0 )
			}
			additional={ { page: 1 } }
			placeholder={ placeholder }
		/>
	);
};

// =====
// HOOKS
// =====

const usePost = ( type: string, value?: number ) =>
	useSelect( ( select ) =>
		type === 'nab_experiment'
			? select( NSR_DATA ).getExperiment( `${ value }` || '0' )
			: select( NSR_DATA ).getEntityRecord( type, value || 0 )
	);

const useIsLoadingPost = ( type: string, value?: number ) => {
	const post = usePost( type, value );
	return !! value && ! post;
};

const usePlaceholder = (
	{ type, id }: { type: string; id?: number },
	defaultPlaceholder?: string
): string => {
	const isLoading = useIsLoadingPost( type, id );
	if ( isLoading ) {
		return _x( 'Loading…', 'text', 'nelio-session-recordings' );
	} //end if

	if ( defaultPlaceholder ) {
		return defaultPlaceholder;
	} //end if

	switch ( type ) {
		case 'page':
			return _x( 'Select a page…', 'user', 'nelio-session-recordings' );
		case 'post':
			return _x( 'Select a post…', 'user', 'nelio-session-recordings' );
		case 'product':
			return _x(
				'Select a product…',
				'user',
				'nelio-session-recordings'
			);
		case 'nab_experiment':
			return _x( 'Select a test…', 'user', 'nelio-session-recordings' );
		default:
			return _x( 'Select…', 'user', 'nelio-session-recordings' );
	} //end switch
};

const useOptionLoader = ( {
	type,
	perPage = 50,
	filter = () => true,
}: OptionLoaderProps ) => {
	const { receiveEntityRecords, receiveExperiments } =
		useDispatch( NSR_DATA );

	const cacheEntities = (
		entities: ReadonlyArray< EntityInstance > | ReadonlyArray< Experiment >
	): void =>
		void (
			entities.length &&
			( type === 'nab_experiment'
				? receiveExperiments( entities as ReadonlyArray< Experiment > )
				: receiveEntityRecords(
						type,
						entities as ReadonlyArray< EntityInstance >
				  ) )
		);

	return type === 'nab_experiment'
		? ( query: string, _: unknown, args?: { page: number } ) =>
				apiFetch< PaginatedResults< ReadonlyArray< Experiment > > >( {
					path: addQueryArgs( '/neliosr/v1/experiment/search', {
						query,
						page: args?.page ?? 1,
						per_page: perPage,
					} ),
				} ).then( ( data ) => {
					cacheEntities( data.results );
					const results = data.results.filter( filter );
					return {
						options: results.map( ( option ) => ( {
							value: parseInt( option.id ),
							label: option.name,
							type,
						} ) ),
						hasMore: data.pagination.more,
						additional: {
							page: ( args?.page ?? 1 ) + 1,
						},
					};
				} )
		: ( query: string, _: unknown, args?: { page: number } ) =>
				apiFetch< PaginatedResults< ReadonlyArray< EntityInstance > > >(
					{
						path: addQueryArgs( '/neliosr/v1/post/search', {
							query,
							type,
							page: args?.page ?? 1,
							per_page: perPage,
						} ),
					}
				).then( ( data ) => {
					cacheEntities( data.results );
					const results = data.results.filter( filter );
					return {
						options: results.map( ( option ) => ( {
							value: option.id,
							label: option.title,
							type,
						} ) ),
						hasMore: data.pagination.more,
						additional: {
							page: ( args?.page ?? 1 ) + 1,
						},
					};
				} );
};

// =======
// HELPERS
// =======

function isTest( p: Experiment | EntityInstance | undefined ): p is Experiment {
	return !! p && typeof p === 'object' && 'name' in p;
} //end isTest()

const numberify = ( x: Maybe< number | string > ): Maybe< number > => {
	if ( undefined === x ) {
		return;
	} //end if

	if ( 'number' === typeof x ) {
		return x;
	} //end if

	const n = Number.parseInt( x );
	return Number.isNaN( n ) ? undefined : n;
};
