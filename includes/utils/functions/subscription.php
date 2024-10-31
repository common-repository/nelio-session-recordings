<?php
/**
 * Nelio Session Recordings subscription-related functions.
 *
 * @since 1.0.0
 */

defined( 'ABSPATH' ) || exit;

/**
 * This function returns the current monthly quota, if any.
 *
 * @return int monthly quota.
 *
 * @since 1.0.0
 */
function neliosr_get_monthly_quota() {
	$site = neliosr_get_site( 'cache' );
	if ( is_wp_error( $site ) ) {
		return $site;
	}//end if

	return absint( neliosr_array_get( $site, array( 'subscription', 'quotaPerMonth' ), 0 ) );
}//end neliosr_get_monthly_quota()

/**
 * Returns whether the current user is subscribed or not.
 *
 * @return boolean whether the current user is subscribed or not.
 *
 * @since 1.0.0
 */
function neliosr_is_subscribed() {
	return (
		neliosr_is_subscribed_to_standalone() ||
		neliosr_is_subscribed_to_addon()
	);
}//end neliosr_is_subscribed()

/**
 * Returns whether the current user is subscribed or not.
 *
 * @return boolean whether the current user is subscribed or not.
 *
 * @since 1.0.0
 */
function neliosr_is_subscribed_to_standalone() {
	return ! empty( get_option( 'neliosr_subscription', false ) );
}//end neliosr_is_subscribed_to_standalone()

/**
 * Returns whether the current user is subscribed to Nelio A/B Testing or not.
 *
 * @return boolean whether the current user is subscribed to Nelio A/B Testing or not.
 *
 * @since 1.0.1
 */
function neliosr_is_subscribed_to_nab() {
	return function_exists( 'nab_get_subscription' ) && ! empty( nab_get_subscription() );
}//end neliosr_is_subscribed_to_nab()

/**
 * Returns whether the current user is paying the addon or not.
 *
 * @return boolean whether the current user is paying the addon or not.
 *
 * @since 1.0.0
 */
function neliosr_is_subscribed_to_addon() {
	if ( ! neliosr_is_subscribed_to_nab() ) {
		return false;
	}//end if

	$addons = function_exists( 'nab_get_subscription_addons' )
		? nab_get_subscription_addons()
		: array();
	foreach ( $addons as $addon ) {
		if ( strpos( $addon, 'nsr-addon' ) === 0 ) {
			return true;
		}//end if
	}//end foreach

	return false;
}//end neliosr_is_subscribed_to_addon()

/**
 * Returns whether the plugin is integrated into Nelio A/B Testing or not.
 *
 * @return boolean whether the plugin is integrated or not.
 *
 * @since 1.0.1
 */
function neliosr_is_integrated_to_nab() {
	if ( neliosr_is_nab_active() && neliosr_is_subscribed_to_addon() ) {
		return true;
	}//end if

	if ( neliosr_is_subscribed_to_standalone() ) {
		return false;
	}//end if

	if ( ! empty( get_option( 'neliosr_site_id', false ) ) ) {
		return false;
	}//end if

	return neliosr_is_nab_active();
}//end neliosr_is_integrated_to_nab()

/**
 * Returns whether Nelio A/B Testing is active and properly set up.
 *
 * @return boolean whether the plugin is active and properly set up.
 *
 * @since 1.0.1
 */
function neliosr_is_nab_active() {
	return function_exists( 'nab_get_site_id' ) && ! empty( nab_get_site_id() );
}//end neliosr_is_nab_active()

/**
 * Returns the site from the cache (if available and require) or from AWS.
 *
 * @param string $mode Either `cache` or `live`.
 *
 * @return array the site.
 *
 * @since 1.0.1
 */
function neliosr_get_site( $mode ) {
	if ( 'cache' === $mode ) {
		$site = get_transient( 'neliosr_site_object' );
		if ( ! empty( $site ) ) {
			return $site;
		}//end if
	}//end if

	$data = array(
		'method'    => 'GET',
		'timeout'   => apply_filters( 'neliosr_request_timeout', 30 ),
		'sslverify' => ! neliosr_does_api_use_proxy(),
		'headers'   => array(
			'Authorization' => 'Bearer ' . neliosr_generate_api_auth_token(),
			'accept'        => 'application/json',
			'content-type'  => 'application/json',
		),
	);

	$url      = neliosr_get_api_url( '/site/' . neliosr_get_site_id(), 'wp' );
	$response = wp_remote_request( $url, $data );

	// If the response is an error, leave.
	$error = neliosr_maybe_return_error_json( $response );
	if ( $error ) {
		delete_transient( 'neliosr_site_object' );
		return $error;
	}//end if

	// Regenerate the account result and send it to the JS.
	$site = json_decode( $response['body'], true );
	set_transient( 'neliosr_site_object', $site, HOUR_IN_SECONDS / 2 );
	return $site;
}//end neliosr_get_site()
