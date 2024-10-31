/**
 * Represent a string like `2021-01-08`
 */
export type Day = string;
export type WeekDay = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

/**
 * Represent a string like `14:42`
 */
export type Time = string;

/**
 * Represent a string like `2021-01-08T14:42:34.678Z` (format: ISO 8601).
 */
export type Datetime = string;

declare global {
	interface Date {
		/**
		 * Give a more precise return type to the method `toISOString()`:
		 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
		 */
		toISOString(): Datetime;
	}
}
