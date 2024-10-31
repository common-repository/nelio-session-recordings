<?php
/**
 * This file contains the class that defines REST API endpoints for
 * managing the Nelio Session Recordings plugin.
 *
 * @since 1.3.0
 */

defined( 'ABSPATH' ) || exit;

class Nelio_Session_Recordings_Plugin_REST_Controller extends WP_REST_Controller {

	/**
	 * The single instance of this class.
	 *
	 * @since  1.3.0
	 * @access protected
	 * @var    Nelio_Session_Recordings_Plugin_REST_Controller
	 */
	protected static $instance;

	/**
	 * Returns the single instance of this class.
	 *
	 * @return Nelio_Session_Recordings_Plugin_REST_Controller the single instance of this class.
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
	 * @since  1.3.0
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
			'/plugin/clean',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'clean_plugin' ),
					'permission_callback' => array( $this, 'check_if_user_can_deactivate_plugin' ),
				),
			)
		);

	}//end register_routes()

	/**
	 * Returns whether the user can use the plugin or not.
	 *
	 * @return boolean whether the user can use the plugin or not.
	 */
	public function check_if_user_can_deactivate_plugin() {
		return current_user_can( 'deactivate_plugin', neliosr_instance()->plugin_file );
	}//end check_if_user_can_deactivate_plugin()

	/**
	 * Cleans the plugin. If a reason is provided, it tells our cloud what happened.
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_REST_Response The response
	 */
	public function clean_plugin( $request ) {

		$nonce = $request['neliosrnonce'];
		if ( ! wp_verify_nonce( $nonce, 'neliosr_clean_plugin_data_' . get_current_user_id() ) ) {
			return new WP_Error( 'invalid-nonce' );
		}//end if

		$reason = $request['reason'];
		$reason = ! empty( $reason ) ? $reason : 'none';

		// 1. Clean cloud.
		$data = array(
			'method'    => 'DELETE',
			'timeout'   => apply_filters( 'neliosr_request_timeout', 30 ),
			'sslverify' => ! neliosr_does_api_use_proxy(),
			'body'      => wp_json_encode(
				array(
					'reason'   => $reason,
					'keepSite' => neliosr_is_integrated_to_nab(),
				)
			),
			'headers'   => array(
				'Authorization' => 'Bearer ' . neliosr_generate_api_auth_token(),
				'accept'        => 'application/json',
				'content-type'  => 'application/json',
			),
		);

		$url      = neliosr_get_api_url( '/site/' . neliosr_get_site_id(), 'wp' );
		$response = wp_remote_request( $url, $data );
		$error    = neliosr_maybe_return_error_json( $response );
		if ( $error ) {
			return $error;
		}//end if

		// Clean database.
		global $wpdb;
		$wpdb->query( $wpdb->prepare( "DELETE FROM $wpdb->options WHERE option_name LIKE %s", array( 'neliosr_%' ) ) ); // phpcs:ignore

		return new WP_REST_Response( true, 200 );

	}//end clean_plugin()

}//end class
