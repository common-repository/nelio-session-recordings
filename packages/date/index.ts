/**
 * WordPress dependencies
 */
import { date as __date, dateI18n, getSettings } from '@safe-wordpress/date';

/**
 * External dependencies
 */
import moment, { Moment } from 'moment';
import 'moment-duration-format';
// momentDurationFormatSetup( moment );

export {
	format,
	getDate,
	humanTimeDiff,
	isInTheFuture,
} from '@safe-wordpress/date';

export function date( format: string, d: string | Date | Moment ): string {
	const settings = getSettings();
	return __date( format, d, settings.timezone.offset );
} //end date()

export function formatI18nDate( d: string | Date | Moment ): string {
	const settings = getSettings();
	return dateI18n( settings.formats.date, d, settings.timezone.offset );
} //end formatI18nDate()

export function formatI18nDatetime( d: string | Date ): string {
	const settings = getSettings();
	return dateI18n(
		settings.formats.datetimeAbbreviated,
		d,
		settings.timezone.offset
	);
} //end formatI18nDatetime()

export function getLocale(): string {
	const settings = getSettings();
	return settings.l10n.locale;
} //end getLocale()

export function formatDateToUtc( d: string ): string {
	if ( d.endsWith( 'Z' ) ) {
		return d;
	} //end if

	if ( /[+-][0-9]{2}:?[0-9]{2}$/.test( d ) ) {
		return moment( d ).toISOString();
	} //end if

	const settings = getSettings();
	const offset = fixTimezoneOffsetForMoment(
		Number.parseFloat( settings.timezone.offset )
	);
	return moment( d + offset ).toISOString();
} //end formatDateToUtc()

export function formatDuration(
	value: number,
	unit: 'seconds' | 'milliseconds'
): string {
	return moment.duration( value, unit ).format( 'mm:ss', {
		trim: false,
	} );
} //end formatDuration()

// =======
// HELPERS
// =======

function fixTimezoneOffsetForMoment( offset: number ) {
	const hours = Math.floor( Math.abs( offset ) );
	const decs = Math.abs( offset ) - hours;
	const mins = Math.round( 60 * decs );
	const strHours = `${ hours }`.padStart( 2, '0' );
	const strMins = `${ mins }`.padStart( 2, '0' );
	const sign = 0 <= offset ? '+' : '-';
	return `${ sign }${ strHours }${ strMins }`;
} //end fixTimezoneOffsetForMoment()
