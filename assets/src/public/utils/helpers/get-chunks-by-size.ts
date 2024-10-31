import { stringify } from './internal/safe-stringify';

type SizeCalcFunction< T > = ( obj: T ) => number;

export function getChunksBySize< T >( {
	input,
	bytesSize = Number.MAX_SAFE_INTEGER,
	failOnOversize = false,
	sizeCalcFunction = getObjectSize< T >,
}: {
	input: T[];
	bytesSize?: number;
	failOnOversize?: boolean;
	sizeCalcFunction?: SizeCalcFunction< T >;
} ): T[][] {
	const output: T[][] = [];
	let outputSize = 0;
	let outputFreeIndex = 0;

	if ( ! input || input.length === 0 || bytesSize <= 0 ) {
		return output;
	} //end if

	for ( const obj of input ) {
		const objSize = sizeCalcFunction( obj );

		if ( objSize > bytesSize && failOnOversize ) {
			throw new Error(
				`Can't chunk array as item is bigger than the max chunk size`
			);
		} //end if

		const fitsIntoLastChunk = outputSize + objSize <= bytesSize;

		if ( fitsIntoLastChunk ) {
			if ( ! Array.isArray( output[ outputFreeIndex ] ) ) {
				output[ outputFreeIndex ] = [];
			} //end if

			output[ outputFreeIndex ]?.push( obj );
			outputSize += objSize;
		} else {
			if ( output[ outputFreeIndex ] ) {
				outputFreeIndex++;
				outputSize = 0;
			} //end if

			output[ outputFreeIndex ] = [];
			output[ outputFreeIndex ]?.push( obj );
			outputSize += objSize;
		} //end if
	} //end for

	return output;
}

function getObjectSize< T >( obj: T ): number {
	try {
		const str = stringify( obj );

		return Buffer.byteLength( str, 'utf8' );
	} catch ( error ) {
		return 0;
	} //end try/catch
} //end getObjectSize()
