/**
 * External dependencies
 */
import moment, { Moment } from 'moment';

export function convertDateToMomentObject( date?: string | Moment ): Moment {
	if ( 'string' === typeof date && '' !== date.trim() ) {
		try {
			date = moment( date );
		} catch ( e ) {
			/* Nothing to be done. */
		}
	} //end if

	if ( 'object' !== typeof date ) {
		date = moment();
	} //end if

	return date;
} //end convertDateToMomentObject()

export type Duration = {
	readonly years: number;
	readonly months: number;
	readonly days: number;
	readonly hours: number;
	readonly minutes: number;
};

export function computeDuration( start: string, end?: string ): Duration {
	const endMoment = convertDateToMomentObject( end );

	let years: number,
		months: number,
		days: number,
		hours: number,
		minutes: number;
	const duration = moment.duration( endMoment.diff( start ) );

	years = duration.years();
	duration.subtract( years, 'years' );
	years = Math.floor( years );

	months = duration.months();
	duration.subtract( months, 'months' );
	months = Math.floor( months );

	days = duration.days();
	duration.subtract( days, 'days' );
	days = Math.floor( days );

	hours = duration.hours();
	duration.subtract( hours, 'hours' );
	hours = Math.floor( hours );

	minutes = duration.minutes();
	duration.subtract( minutes, 'minutes' );
	minutes = Math.floor( minutes );

	return { years, months, days, hours, minutes };
} //end computeDuration()

export function getDaysSince( date: string ): number {
	const dateMoment = convertDateToMomentObject( date );
	const duration = moment.duration( moment().diff( dateMoment ) );
	return Math.abs( Math.ceil( duration.asDays() ) );
} //end getDaysSince()
