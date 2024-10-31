export function differenceInDays(
	d1: string | Date,
	d2: string | Date
): number {
	if ( 'string' === typeof d1 ) {
		d1 = new Date( d1 );
	} //end if

	if ( 'string' === typeof d2 ) {
		d2 = new Date( d2 );
	} //end if

	const now = new Date();
	if ( ! d1 || isNaN( d1.getTime() ) ) {
		d1 = now;
	} //end if

	if ( ! d2 || isNaN( d2.getTime() ) ) {
		d2 = now;
	} //end if

	const diffTime = Math.abs( d2.getTime() - d1.getTime() );
	return Math.ceil( diffTime / ( 1000 * 60 * 60 * 24 ) );
} //end differenceInDays()
