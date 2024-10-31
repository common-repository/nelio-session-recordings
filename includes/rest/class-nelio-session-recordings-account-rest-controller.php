<?php
/**
 * This file contains the class that defines REST API endpoints for
 * managing a Nelio Session Recordings account.
 *
 * @since 1.0.0
 */

defined( 'ABSPATH' ) || exit;

class Nelio_Session_Recordings_Account_REST_Controller extends WP_REST_Controller {

	/**
	 * The single instance of this class.
	 *
	 * @since  1.0.0
	 * @access protected
	 * @var    Nelio_Session_Recordings_Account_REST_Controller
	 */
	protected static $instance;

	/**
	 * Returns the single instance of this class.
	 *
	 * @return Nelio_Session_Recordings_Account_REST_Controller the single instance of this class.
	 *
	 * @access public
	 */
	public static function instance() {

		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}//end if

		return self::$instance;

	}//end instance()

	/**
	 * Hooks into WordPress.
	 *
	 * @since  1.0.0
	 * @access public
	 */
	public function init() {

		add_action( 'rest_api_init', array( $this, 'register_routes' ) );

	}//end init()

	/**
	 * Register the routes for the objects of the controller.
	 */
	public function register_routes() {

		register_rest_route(
			neliosr_instance()->rest_namespace,
			'/site/quota',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_site_quota' ),
					'permission_callback' => neliosr_capability_checker( 'edit_neliosr_recordings' ),
					'args'                => array(),
				),
			)
		);

		register_rest_route(
			neliosr_instance()->rest_namespace,
			'/license',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'connect_subscription' ),
					'permission_callback' => neliosr_capability_checker( 'manage_neliosr_options' ),
					'args'                => array(
						'license' => array(
							'required'          => true,
							'sanitize_callback' => 'sanitize_text_field',
						),
					),
				),
				array(
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => array( $this, 'disconnect_subscription' ),
					'permission_callback' => neliosr_capability_checker( 'manage_neliosr_options' ),
					'args'                => array(),
				),
			)
		);

	}//end register_routes()

	/**
	 * Retrieves this site’s quota.
	 *
	 * @return WP_REST_Response The response
	 */
	public function get_site_quota() {
		$site = neliosr_get_site( 'cache' );
		if ( is_wp_error( $site ) ) {
			return $site;
		}//end if

		$subs_quota = absint( neliosr_array_get( $site, array( 'subscription', 'quota' ), 0 ) );
		$subs_extra = absint( neliosr_array_get( $site, array( 'subscription', 'quotaExtra' ), 0 ) );
		$subs_month = absint( neliosr_array_get( $site, array( 'subscription', 'quotaPerMonth' ), 1 ) );

		$site_used  = absint( neliosr_array_get( $site, 'usedMonthlyQuota', 0 ) );
		$site_month = absint( neliosr_array_get( $site, 'maxMonthlyQuota', 0 ) );

		$available_quota = $site_month
			? max( 0, $site_month - $site_used )
			: max( 0, $subs_quota ) + max( 0, $subs_extra );

		$percentage = $site_month
			? floor( ( 100 * ( $available_quota + 0.1 ) ) / $site_month )
			: floor( ( 100 * ( $available_quota + 0.1 ) ) / $subs_month );

		$quota = array(
			'availableQuota' => $available_quota,
			'percentage'     => $percentage,
		);
		return new WP_REST_Response( $quota, 200 );
	}//end get_site_quota()

	/**
	 * Sets a subscription in this site.
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_REST_Response The response
	 */
	public function connect_subscription( $request ) {
		$license = $request->get_param( 'license' );

		$params = array(
			'license'     => $license,
			'productType' => 'nsr',
		);

		$data = array(
			'method'    => 'POST',
			'timeout'   => apply_filters( 'neliosr_request_timeout', 30 ),
			'sslverify' => ! neliosr_does_api_use_proxy(),
			'headers'   => array(
				'Authorization' => 'Bearer ' . neliosr_generate_api_auth_token(),
				'accept'        => 'application/json',
				'content-type'  => 'application/json',
			),
			'body'      => wp_json_encode( $params ),
		);

		$url      = neliosr_get_api_url( '/site/' . neliosr_get_site_id() . '/subscription', 'wp' );
		$response = wp_remote_request( $url, $data );

		// If the response is an error, leave.
		$error = neliosr_maybe_return_error_json( $response );
		if ( $error ) {
			return new WP_Error( 'unknown-error', "Invalid license $license." );
		}//end if

		// Regenerate the account result and send it to the JS.
		$site_info = json_decode( $response['body'], true );
		set_transient( 'neliosr_site_object', $site_info, HOUR_IN_SECONDS / 2 );

		// Mark active subscription.
		update_option( 'neliosr_subscription', 'yes' );

		return new WP_REST_Response( true, 200 );
	}//end connect_subscription()

	/**
	 * Removes the subscription in this site.
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_REST_Response The response
	 */
	public function disconnect_subscription( $request ) {
		$data = array(
			'method'    => 'DELETE',
			'timeout'   => apply_filters( 'neliosr_request_timeout', 30 ),
			'sslverify' => ! neliosr_does_api_use_proxy(),
			'headers'   => array(
				'Authorization' => 'Bearer ' . neliosr_generate_api_auth_token(),
				'accept'        => 'application/json',
				'content-type'  => 'application/json',
			),
		);

		$url      = neliosr_get_api_url( '/site/' . neliosr_get_site_id() . '/subscription', 'wp' );
		$response = wp_remote_request( $url, $data );

		// If the response is an error, leave.
		$error = neliosr_maybe_return_error_json( $response );
		if ( $error ) {
			return new WP_Error( 'unknown-error', _x( 'Error while disconnecting license.', 'text', 'nelio-session-recordings' ) );
		}//end if

		// Regenerate the account result and send it to the JS.
		$site_info = json_decode( $response['body'], true );
		set_transient( 'neliosr_site_object', $site_info, HOUR_IN_SECONDS / 2 );
		delete_option( 'neliosr_subscription' );

		return new WP_REST_Response( true, 200 );
	}//end disconnect_subscription()

}//end class
