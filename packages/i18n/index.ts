export function numberFormat( num: number, options = {} ): string {
	options = {
		maximumFractionDigits: 2,
		...options,
	};
	const locale = hasI18n( window )
		? window.neliosrI18n.locale || 'en-US'
		: 'en-US';
	return Intl.NumberFormat( locale, options ).format( num );
} //end numberFormat()

export function compactInteger( num: number ): string {
	if ( num < 1000 ) {
		return `${ num }`;
	} //end if

	if ( num < 1_000_000 ) {
		return numberFormat( num / 1000, { maximumFractionDigits: 1 } ) + 'k';
	} //end if

	return numberFormat( num / 1_000_000, { maximumFractionDigits: 1 } ) + 'M';
} //end compactInteger()

// =======
// HELPERS
// =======

// eslint-ignore-next-line camelcase
const hasI18n = ( x: unknown ): x is { neliosrI18n: { locale: string } } =>
	!! x && 'object' === typeof x && 'neliosrI18n' in x;
