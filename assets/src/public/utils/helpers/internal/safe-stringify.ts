/* eslint-disable no-bitwise */
/* eslint-disable @typescript-eslint/no-explicit-any */
export function stringify(
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	obj: any,
	replacer?: ( key: string, value: any ) => any,
	spaces?: number | string,
	cycleReplacer?: ( key: string, value: any ) => any
): string {
	return JSON.stringify(
		obj,
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		serializer.call( obj, replacer, cycleReplacer ),
		spaces
	);
}

function serializer(
	this: any,
	replacer?: ( key: string, value: any ) => any,
	cycleReplacer?: ( this: any, key: string, value: any ) => any
): ( this: any, key: string, value: any ) => any {
	const stack: any[] = [];
	const keys: string[] = [];

	if ( cycleReplacer === null ) {
		cycleReplacer = function ( _, value ) {
			if ( stack[ 0 ] === value ) return '[Circular ~]';
			return (
				'[Circular ~.' +
				keys.slice( 0, stack.indexOf( value ) ).join( '.' ) +
				']'
			);
		};
	}

	return function ( this: any, key, value ) {
		if ( stack.length > 0 ) {
			const thisPos = stack.indexOf( this );
			// eslint-disable-next-line no-unused-expressions
			~thisPos ? stack.splice( thisPos + 1 ) : stack.push( this );
			// eslint-disable-next-line no-unused-expressions
			~thisPos ? keys.splice( thisPos, Infinity, key ) : keys.push( key );

			if ( ~stack.indexOf( value ) ) {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				value = cycleReplacer!.call( this, key, value );
			}
		} else {
			stack.push( value );
		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return replacer === null ? value : replacer?.call( this, key, value );
	};
}
