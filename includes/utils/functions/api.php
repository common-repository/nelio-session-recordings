<?php
/**
 * This file contains several helper functions that deal with the AWS API.
 *
 * @since 1.0.0
 */

defined( 'ABSPATH' ) || exit;

/**
 * Whether to use Nelio’s proxy instead of accessing AWS directly or not.
 *
 * @return boolean whether to use Nelio's proxy instead of accessing AWS directly or not.
 *
 * @since 1.0.0
 */
function neliosr_does_api_use_proxy() {

	/**
	 * Whether the plugin should use Nelio’s proxy instead of accessing AWS directly.
	 *
	 * @param boolean $uses_proxy use Nelio’s proxy instead of accessing AWS directly. Default: `false`.
	 *
	 * @since 1.0.0
	 */
	return apply_filters( 'neliosr_use_nelio_proxy', false );

}//end neliosr_does_api_use_proxy()

/**
 * Returns the API url for the specified method.
 *
 * @param string $method  The metho we want to use.
 * @param string $context Either 'wp' or 'browser', depending on the location
 *                        in which the resulting URL has to be used.
 *                        Only wp calls might use the proxy URL.
 *
 * @return string the API url for the specified method.
 *
 * @since 1.0.0
 */
function neliosr_get_api_url( $method, $context ) {

	if ( 'browser' === $context ) {
		return 'https://api.nelioabtesting.com/v1' . $method;
	}//end if

	if ( neliosr_does_api_use_proxy() ) {
		return 'https://neliosoftware.com/proxy/testing-api/v1' . $method;
	} else {
		return 'https://api.nelioabtesting.com/v1' . $method;
	}//end if

}//end neliosr_get_api_url()

/**
 * A token for accessing the API.
 *
 * @since 1.3.0
 * @var   string
 */
$neliosr_api_token = '';

/**
 * Returns a new token for accessing the API.
 *
 * @param string $mode Either 'regular' or 'skip-errors'. If the latter is used, the function
 *                     won't generate any HTML errors.
 *
 * @return string a new token for accessing the API.
 *
 * @since 5.0.0
 */
function neliosr_generate_api_auth_token( $mode = 'regular' ) {

	global $neliosr_api_token;

	// If we already have a token, return it.
	if ( ! empty( $neliosr_api_token ) ) {
		return $neliosr_api_token;
	}//end if

	// If we don't, let's see if there's a transient.
	$transient_name     = 'neliosr_api_token' . get_current_user_id();
	$neliosr_api_token  = get_transient( $transient_name );
	$transient_exp_date = get_option( '_transient_timeout_' . $transient_name );

	if ( ! empty( $transient_exp_date ) && ! empty( $neliosr_api_token ) ) {
		return $neliosr_api_token;
	}//end if

	// If we don't have a token, let's get a new one.
	$uid    = get_current_user_id();
	$role   = 'editor';
	$secret = neliosr_get_api_secret();

	$neliosr_api_token = '';

	$data = array(
		'method'    => 'POST',
		'timeout'   => apply_filters( 'neliosr_request_timeout', 30 ),
		'sslverify' => ! neliosr_does_api_use_proxy(),
		'headers'   => array(
			'accept'       => 'application/json',
			'content-type' => 'application/json',
		),
		'body'      => wp_json_encode(
			array(
				'id'   => $uid,
				'role' => $role,
				'auth' => md5( $uid . $role . $secret ),
			)
		),
	);

	// Iterate to obtain the token, or else things will go wrong.
	$url = neliosr_get_api_url( '/site/' . neliosr_get_site_id() . '/key', 'wp' );
	for ( $i = 0; $i < 3; ++$i ) {

		$response = wp_remote_request( $url, $data );
		if ( ! neliosr_is_response_valid( $response ) ) {
			sleep( 3 );
			continue;
		}//end if

		// Save the new token.
		$response = json_decode( $response['body'], true );
		if ( isset( $response['token'] ) ) {
			$neliosr_api_token = $response['token'];
		}//end if

		if ( ! empty( $neliosr_api_token ) ) {
			break;
		}//end if

		sleep( 3 );

	}//end for

	if ( ! empty( $neliosr_api_token ) ) {
		set_transient( $transient_name, $neliosr_api_token, 25 * MINUTE_IN_SECONDS );
	}//end if

	// Send error if we couldn't get an API key.
	if ( 'skip-errors' !== $mode ) {

		if ( empty( $neliosr_api_token ) ) {

			if ( defined( 'DOING_AJAX' ) && DOING_AJAX ) {
				header( 'HTTP/1.1 500 Internal Server Error' );
				wp_send_json( _x( 'There was an error while accessing Nelio Session Recordings’ API.', 'error', 'nelio-session-recordings' ) );
			} else {
				return false;
			}//end if
		}//end if
	}//end if

	return $neliosr_api_token;

}//end neliosr_generate_api_auth_token()

/**
 * Returns a particular error message.
 *
 * @param string         $code    API error code.
 * @param string|boolean $default Optional. Default error message.
 *
 * @return string Error message associated to the given error code.
 *
 * @since  5.0.0
 * @access public
 */
function neliosr_get_error_message( $code, $default = false ) {

	switch ( $code ) {

		case 'LicenseNotFound':
			return _x( 'Invalid license code.', 'error', 'nelio-session-recordings' );

		default:
			return $default;

	}//end switch

}//end neliosr_get_error_message()

/**
 * This function checks whether the response of a `wp_remote_*` call is valid
 * or not. A response is valid if it's not a WP_Error and the response code is
 * 200.
 *
 * @param array $response the response of a `wp_remote_*` call.
 *
 * @return boolean Whether the response is valid (i.e. not a WP_Error and a 200
 *                 response code) or not.
 *
 * @since 1.0.0
 */
function neliosr_is_response_valid( $response ) {

	if ( is_wp_error( $response ) ) {
		return false;
	}//end if

	if ( isset( $response['body'] ) ) {
		$body = json_decode( $response['body'], true );
		$body = ! empty( $body ) ? $body : array();
		if ( isset( $body['errorType'] ) && isset( $body['errorMessage'] ) ) {
			return false;
		}//end if
	}//end if

	if ( ! isset( $response['response'] ) ) {
		return true;
	}//end if

	$response = $response['response'];
	if ( ! isset( $response['code'] ) ) {
		return true;
	}//end if

	if ( 200 === $response['code'] ) {
		return true;
	}//end if

	return false;

}//end neliosr_is_response_valid()

/**
 * This function checks if the given response is valid or not. If it isn't,
 * it'll return a WP_Error (forwarding the original error code or
 * generating a new `500 Internal Server Error`) and a message describing the
 * error.
 *
 * @param array $response the response of a `wp_remote_*` call.
 *
 * @since 5.0.0
 */
function neliosr_maybe_return_error_json( $response ) {

	if ( neliosr_is_response_valid( $response ) ) {
		return;
	}//end if

	// If we couldn't open the page, let's return an empty result object.
	if ( is_wp_error( $response ) ) {
		return new WP_Error(
			'server-error',
			_x( 'Unable to access Nelio’s API.', 'text', 'nelio-session-recordings' )
		);
	}//end if

	// Extract body and response.
	$body     = json_decode( $response['body'], true );
	$response = $response['response'];

	// If the error is not an Unauthorized request, let's forward it to the user.
	$summary = $response['code'] . ' ' . $response['message'];
	if ( false === preg_match( '/^HTTP\/1.1 [0-9][0-9][0-9]( [A-Z][a-z]+)+$/', 'HTTP/1.1 ' . $summary ) ) {
		$summary = '500 Internal Server Error';
	}//end if

	// Check if the API returned an error code and error message.
	$error_message = false;
	if ( ! empty( $body['errorType'] ) && ! empty( $body['errorMessage'] ) ) {
		$error_message = neliosr_get_error_message( $body['errorType'], $body['errorMessage'] );
		if ( ! empty( $error_message ) ) {
			return new WP_Error(
				$body['errorType'],
				$error_message
			);
		}//end if
	}//end if

	if ( empty( $error_message ) ) {
		$error_message = sprintf(
			/* translators: the placeholder is a string explaining the error returned by the API. */
			_x( 'There was an error while accessing Nelio’s API: %s.', 'error', 'nelio-session-recordings' ),
			$summary
		);
	}//end if

	// Send code.
	return new WP_Error(
		'server-error',
		$error_message
	);

}//end neliosr_maybe_return_error_json()

/**
 * Returns the API secret.
 *
 * @return string the API secret.
 *
 * @since 1.0.0
 */
function neliosr_get_api_secret() {
	if ( neliosr_is_integrated_to_nab() ) {
		return function_exists( 'nab_get_api_secret' )
			? nab_get_api_secret()
			: false;
	}//end if

	return get_option( 'neliosr_api_secret', false );
}//end neliosr_get_api_secret()
