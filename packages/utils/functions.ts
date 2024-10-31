/**
 * WordPress dependencies.
 */
import { dispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';
import { store as noticesStore } from '@safe-wordpress/notices';
const NOTICES = noticesStore?.name ?? 'core/notices';

/**
 * External dependencies.
 */
import {
	omit,
	keys,
	mapValues,
	values,
	sortBy,
	reduce,
	reverse,
	uniq,
} from 'lodash';
import type { Dict, NumberMatch, StringMatch } from '@neliosr/types';

const AND = _x( ' and ', 'text (2 item list)', 'nelio-session-recordings' );
const AND_PLUS = _x(
	', and ',
	'text (2+ item list)',
	'nelio-session-recordings'
);
const OR = _x( ' or ', 'text (2 item list)', 'nelio-session-recordings' );
const OR_PLUS = _x(
	', or ',
	'text (2+ item list)',
	'nelio-session-recordings'
);

export const hasHead = < T >( arr: ReadonlyArray< T > ): arr is [ T, ...T[] ] =>
	arr.length > 0;

export const isSingleton = < T >( arr: ReadonlyArray< T > ): arr is [ T ] =>
	arr.length === 1;

export const isMultiArray = < T >(
	arr: ReadonlyArray< T >
): arr is [ T, T, ...T[] ] => arr.length > 1;

export const isNumber = ( n: unknown ): n is number => 'number' === typeof n;

export function listify(
	mode: 'and' | 'or',
	tokens: ReadonlyArray< string >
): string {
	if ( ! hasHead( tokens ) ) {
		return '';
	} //end if

	if ( ! hasTwoItems( tokens ) ) {
		return tokens[ 0 ];
	} //end if

	const andor = (): string => {
		if ( 'and' === mode ) {
			return tokens.length === 2 ? AND : AND_PLUS;
		} //end if
		return tokens.length === 2 ? OR : OR_PLUS;
	};

	const [ z, y, ...x ] = reverse( tokens );
	return [ ...reverse( x ), `${ y }${ andor() }${ z }` ].join( ', ' );
} //end listify()

export function createErrorNotice(
	error: unknown,
	defaultError?: string
): void {
	if ( hasErrors( error ) ) {
		dispatch( NOTICES ).createErrorNotice(
			values( error.errors )[ 0 ] ?? ''
		);
		return;
	} //end if

	if ( hasMessage( error ) ) {
		dispatch( NOTICES ).createErrorNotice( error.message );
		return;
	} //end if

	if ( 'string' === typeof error ) {
		dispatch( NOTICES ).createErrorNotice( error );
		return;
	} //end if

	const message =
		defaultError ??
		_x( 'Unknown error', 'text', 'nelio-session-recordings' );
	dispatch( NOTICES ).createErrorNotice( message );
} //end createErrorNotice()

export function omitUndefineds< T extends Dict >( obj: T ): T {
	return omit(
		obj,
		keys( obj ).filter( ( k ) => undefined === obj[ k ] )
	) as T;
} //end omitUndefineds()

export function sortObjectKeysUsingValue< T extends Record< string, string > >(
	obj: T
): T {
	const collection = mapValues( obj, ( value, key ) => ( { key, value } ) );
	const unsortedList = values( collection );
	const sortedList = sortBy( unsortedList, 'value' );
	return reduce(
		sortedList,
		( acc, { key, value } ) => {
			acc[ key as string ] = value;
			return acc;
		},
		{} as Record< string, string >
	) as T;
} //end sortObjectKeysUsingValue()

export function doesNumberMatch(
	expectedMatch: NumberMatch,
	actualValue = 0
): boolean {
	const { matchType: type } = expectedMatch;
	switch ( type ) {
		case 'between':
			const { minMatchValue, maxMatchValue } = expectedMatch;
			return minMatchValue <= actualValue && actualValue <= maxMatchValue;

		case 'greater-than':
			return expectedMatch.matchValue < actualValue;

		case 'less-than':
			return actualValue < expectedMatch.matchValue;
	} //end switch
} //end doesNumberMatch()

export function doesStringMatch(
	expectedMatch: StringMatch,
	actualValue = '',
	caseInsensitive = false
): boolean {
	const { matchType: type, matchValue: expectedValue } = expectedMatch;
	switch ( type ) {
		case 'is':
			return caseInsensitive
				? expectedValue.toLowerCase() === actualValue.toLowerCase()
				: expectedValue === actualValue;

		case 'is-not':
			return caseInsensitive
				? expectedValue.toLowerCase() !== actualValue.toLowerCase()
				: expectedValue !== actualValue;

		case 'includes':
			return caseInsensitive
				? actualValue
						.toLowerCase()
						.includes( expectedValue.toLowerCase() )
				: actualValue.includes( expectedValue );

		case 'does-not-include':
			return caseInsensitive
				? ! actualValue
						.toLowerCase()
						.includes( expectedValue.toLowerCase() )
				: ! actualValue.includes( expectedValue );

		case 'regex':
			try {
				return new RegExp( expectedValue ).test( actualValue );
			} catch ( e ) {
				return false;
			} //end try
	} //end switch
} //end doesStringMatch()

export function doesCssSelectorMatch(
	expectedMatch: StringMatch,
	actualValue = ''
): boolean {
	const { matchType: type, matchValue: expectedValue } = expectedMatch;
	switch ( type ) {
		case 'is':
			return searchQueryCSS(
				actualValue.toLowerCase(),
				expectedValue.toLowerCase()
			);

		case 'is-not':
			return ! searchQueryCSS(
				actualValue.toLowerCase(),
				expectedValue.toLowerCase()
			);

		case 'includes':
			return actualValue
				.toLowerCase()
				.includes( expectedValue.toLowerCase() );

		case 'does-not-include':
			return ! actualValue
				.toLowerCase()
				.includes( expectedValue.toLowerCase() );

		case 'regex':
			try {
				return new RegExp( expectedValue ).test( actualValue );
			} catch ( e ) {
				return false;
			} //end try
	} //end switch
} //end doesCssSelectorMatch()

export function getLetter( index: number ): string {
	const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXY';
	if ( index >= letters.length ) {
		return 'Z';
	} //end if
	return letters.charAt( index );
} //end getLetter()

const EMPTY_VALUES: unknown[] = [ 0, 0.0, '', false, null, undefined ];
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function isEmpty( value: unknown ): boolean {
	if ( EMPTY_VALUES.includes( value ) ) {
		return true;
	} //end if

	if ( hasLengthFunction( value ) && 0 === value.length() ) {
		return true;
	} //end if

	if ( value && 'object' === typeof value ) {
		return 0 === Object.keys( value ).length;
	} //end if

	return false;
} //end isEmpty()

// =======
// HELPERS
// =======

const hasLengthFunction = ( v: unknown ): v is { length: () => number } =>
	!! v && 'object' === typeof v && 'length' in v && 'function' === v.length;

function searchQueryCSS( css: string, query: string ): boolean {
	let regex = /^$/;
	try {
		regex = new RegExp(
			query
				.toLowerCase()
				.replace( /([\(\)>:])/g, ' $1 ' )
				.split( /\s+/ )
				.map( ( s ) => s.trim() )
				.filter( Boolean )
				.map( escapeRegExp )
				.map( generateClassCombinations )
				.join( '.*' )
		);
	} catch ( e ) {}

	return css.includes( query ) || regex.test( css );
} //end search()

function escapeRegExp( text: string ) {
	return text.replace( /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&' );
} //end escapeRegExp()

function generateClassCombinations( reCssPart: string ) {
	if ( ! reCssPart.includes( '\\.' ) ) {
		return reCssPart;
	} //end if

	const classes = uniq( reCssPart.split( '\\.' ).filter( Boolean ) );
	if ( classes.length < 2 ) {
		return reCssPart;
	} //end if

	return `(\\.${ classes.join( '|\\.' ) }){${ classes.length }}`;
} //end generateClassCombinations()

const hasTwoItems = < T >( arr: ReadonlyArray< T > ): arr is [ T, T, ...T[] ] =>
	arr.length === 2;

const hasErrors = ( x: unknown ): x is { errors: Record< string, string > } =>
	!! values( ( x as Dict ).errors )[ 0 ];

const hasMessage = ( x: unknown ): x is { message: string } =>
	!! x &&
	'object' === typeof x &&
	'string' === typeof ( x as Dict ).message &&
	!! ( x as Dict ).message;
