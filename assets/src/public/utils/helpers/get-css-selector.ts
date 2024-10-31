export function getCssSelector( element: HTMLElement ): string {
	let selector = cssPath( element );
	selector = selector.replace( /:nth-child\([0-9]+\)/g, '' );
	selector = selector.replace( />/g, '' );
	selector = selector.replace( / +/g, ' ' );
	selector = selector.replace( /\.nab[-0-9a-z]*/g, '' );
	return selector;
} //end getCssSelector()

/* eslint-disable */
// SOURCE: https://raw.githubusercontent.com/micnews/css-path/master/css-path.js

function cssPath( elm: HTMLElement ): string {
	return path( elm, undefined, [] ).join( ' > ' );
} //end cssPath()

const classSelector = function ( className: string ) {
	var selectors = className.split( /\s/g ),
		array = [];

	for ( var i = 0; i < selectors.length; ++i ) {
		const s = selectors[ i ];
		if ( ( s?.length ?? 0 ) > 0 ) {
			array.push( '.' + s );
		}
	}

	return array.join( '' );
};

const nthChild = function ( elm: any ) {
	var childNumber = 0,
		childNodes = elm.parentNode.childNodes,
		index = 0;

	for ( ; index < childNodes.length; ++index ) {
		if ( childNodes[ index ].nodeType === 1 ) ++childNumber;

		if ( childNodes[ index ] === elm ) return childNumber;
	}

	return 0;
};

const path = function ( elm: any, rootNode: any, list: any ): string[] {
	var tag = elm.tagName.toLowerCase(),
		selector = [ tag ],
		className = elm.getAttribute( 'class' ),
		id = elm.getAttribute( 'id' );

	if ( id ) {
		list.unshift( tag + '#' + id.trim() );
		return list;
	}

	if ( className ) selector.push( classSelector( className ) );

	if ( tag !== 'html' && tag !== 'body' && elm.parentNode ) {
		selector.push( ':nth-child(' + nthChild( elm ) + ')' );
	}

	list.unshift( selector.join( '' ) );

	if (
		elm.parentNode &&
		elm.parentNode !== rootNode &&
		elm.parentNode.tagName
	) {
		path( elm.parentNode, rootNode, list );
	}

	return list;
};
