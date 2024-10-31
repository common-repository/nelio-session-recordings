/**
 * Internal dependencies
 */
import { getCookie, removeCookie, setCookie } from '../../cookies';
import { SESSION_MAX_TIME } from '../constants';
import type { Session } from '../../../types';

type ParticipationSettings = Pick< Session, 'samplingRate' | 'monthlyQuota' >;

export function doesVisitorParticipate(
	session: ParticipationSettings
): boolean {
	if ( ! session ) {
		return false;
	} //end if

	if ( isIE() ) {
		return false;
	} //end if

	if ( ! areCookiesEnabled() ) {
		return false;
	} //end if

	if ( isVisitorExcludedFromRecording() ) {
		return false;
	} //end if

	const { samplingRate, monthlyQuota } = session;
	switch ( samplingRate.mode ) {
		case 'custom':
			return doesVisitorParticipateAccordingToTheCookie(
				samplingRate.percentage
			);

		case 'uniform':
			if ( monthlyQuota === 0 ) {
				return false;
			} //end if

			const daysInMonth = new Date(
				new Date().getFullYear(),
				new Date().getMonth() + 1,
				0
			).getDate();
			const dailyQuota = Math.floor( monthlyQuota / daysInMonth );
			const dailySessions = Math.floor(
				samplingRate.estimatedSessions / daysInMonth
			);
			return doesVisitorParticipateAccordingToTheCookie(
				Math.min(
					Math.floor( ( dailyQuota / dailySessions ) * 100 ),
					100
				)
			);

		case 'unlimited':
		default:
			return true;
	}
} //end doesVisitorParticipate()

// =======
// HELPERS
// =======

function isIE(): boolean {
	const ua = window.navigator.userAgent || '';
	return -1 !== ua.indexOf( 'MSIE ' ) || -1 !== ua.indexOf( 'Trident/' );
} //end isIE()

function isVisitorExcludedFromRecording(): boolean {
	return !! getCookie( 'neliosrIsVisitorExcluded' );
} //end isVisitorExcludedFromTesting()

function areCookiesEnabled() {
	setCookie( 'neliosrCheckWritePermission', true );
	if ( ! getCookie( 'neliosrCheckWritePermission' ) ) {
		return false;
	} //end if

	removeCookie( 'neliosrCheckWritePermission' );
	return true;
} //end areCookiesEnable();

function doesVisitorParticipateAccordingToTheCookie(
	participationChance: number
) {
	if (
		! isVisitorParticipationCookieValid() ||
		shouldVisitorParticipationCookieBeUpdated( participationChance )
	) {
		generateVisitorParticipationCookie( participationChance );
	} //end if

	const participation = getCookie( 'neliosrParticipation' );
	return 0 === participation?.indexOf( 'true' );
} //end doesVisitorParticipateAccordingToTheCookie()

function isVisitorParticipationCookieValid() {
	const participation = getCookie( 'neliosrParticipation' ) || '';
	return /^(true|false),[0-9]{1,3}$/.test( participation );
} //end isVisitorParticipationCookieValid()

function shouldVisitorParticipationCookieBeUpdated(
	participationChance: number
) {
	const participation = getCookie( 'neliosrParticipation' ) || '';
	return participation.split( ',' )[ 1 ] !== `${ participationChance }`;
} //end shouldVisitorParticipationCookieBeUpdated()

function generateVisitorParticipationCookie( participationChance: number ) {
	const random = Math.min( 100, Math.floor( Math.random() * 101 ) );
	const shouldVisitorParticipate =
		random <= participationChance ? 'true' : 'false';
	setCookie(
		'neliosrParticipation',
		`${ shouldVisitorParticipate },${ participationChance }`,
		{ expires: SESSION_MAX_TIME }
	);
} //end generateVisitorParticipationCookie()
