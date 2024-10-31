<?php
/**
 * This file contains the class that defines REST API endpoints for
 * managing a Nelio Session Recordings.
 *
 * @since 1.0.0
 */

defined( 'ABSPATH' ) || exit;

class Nelio_Session_Recordings_Recording_REST_Controller extends WP_REST_Controller {

	/**
	 * The single instance of this class.
	 *
	 * @since  1.0.0
	 * @access protected
	 * @var    Nelio_Session_Recordings_Recording_REST_Controller
	 */
	protected static $instance;

	/**
	 * Returns the single instance of this class.
	 *
	 * @return Nelio_Session_Recordings_Recording_REST_Controller the single instance of this class.
	 *
	 * @since  1.0.0
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
			'/active-recordings',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_active_recordings' ),
					'permission_callback' => neliosr_capability_checker( 'edit_neliosr_recordings' ),
				),
			)
		);

		register_rest_route(
			neliosr_instance()->rest_namespace,
			'/recordings',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_recordings' ),
					'permission_callback' => neliosr_capability_checker( 'edit_neliosr_recordings' ),
					'args'                => array(
						'key' => array(
							'required'          => false,
							'sanitize_callback' => 'sanitize_text_field',
						),
					),
				),
				array(
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => array( $this, 'remove_recordings' ),
					'permission_callback' => neliosr_capability_checker( 'edit_neliosr_recordings' ),
				),
			)
		);

		register_rest_route(
			neliosr_instance()->rest_namespace,
			'/recording/(?P<id>[\w\-]+)',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_recording' ),
					'permission_callback' => neliosr_capability_checker( 'edit_neliosr_recordings' ),
				),
			)
		);

		register_rest_route(
			neliosr_instance()->rest_namespace,
			'/recording-status',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_recording_status' ),
					'permission_callback' => neliosr_capability_checker( 'manage_neliosr_options' ),
				),
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'set_recording_status' ),
					'permission_callback' => neliosr_capability_checker( 'manage_neliosr_options' ),
				),
			)
		);

	}//end register_routes()

	/**
	 * Obtains the amount of active recordings.
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_REST_Response The response
	 */
	public function get_active_recordings( $request ) {

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

		$url      = neliosr_get_api_url( '/site/' . neliosr_get_site_id() . '/active-sessions', 'wp' );
		$response = wp_remote_request( $url, $data );

		// If the response is an error, leave.
		$error = neliosr_maybe_return_error_json( $response );
		if ( ! empty( $error ) ) {
			return $error;
		}//end if

		$recordings = absint( $response['body'] );
		return new WP_REST_Response( $recordings, 200 );

	}//end get_active_recordings()

	/**
	 * Obtains all recordings.
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_REST_Response The response
	 */
	public function get_recordings( $request ) {

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

		$key      = $request->get_param( 'key' );
		$url      = neliosr_get_api_url( '/site/' . neliosr_get_site_id() . '/sessions', 'wp' );
		$url      = empty( $key ) ? $url : add_query_arg( 'key', $key, $url );
		$response = wp_remote_request( $url, $data );

		// If the response is an error, leave.
		$error = neliosr_maybe_return_error_json( $response );
		if ( ! empty( $error ) ) {
			return $error;
		}//end if

		$recordings = json_decode( $response['body'], true );
		return new WP_REST_Response( $recordings, 200 );

	}//end get_recordings()

	/**
	 * Removes recordings.
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_REST_Response The response
	 */
	public function remove_recordings( $request ) {
		$parameters = $request->get_json_params();
		$ids        = $parameters['ids'];

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

		foreach ( $ids as $id ) {
			$url      = neliosr_get_api_url( '/site/' . neliosr_get_site_id() . '/session/' . $id, 'wp' );
			$response = wp_remote_request( $url, $data );

			// If the response is an error, leave.
			$error = neliosr_maybe_return_error_json( $response );
			if ( ! empty( $error ) ) {
				return $error;
			}//end if
		}//end foreach

		return new WP_REST_Response( 'OK', 200 );

	}//end remove_recordings()

	/**
	 * Obtains all recordings.
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_REST_Response The response
	 */
	public function get_recording( $request ) {

		$recording_id = $request['id'];

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

		$url      = neliosr_get_api_url( '/site/' . neliosr_get_site_id() . '/session/' . $recording_id, 'wp' );
		$response = wp_remote_request( $url, $data );

		// If the response is an error, leave.
		$error = neliosr_maybe_return_error_json( $response );
		if ( ! empty( $error ) ) {
			return $error;
		}//end if

		$recording = json_decode( $response['body'], true );
		return new WP_REST_Response( $recording, 200 );

	}//end get_recording()

	public function get_recording_status() {
		$status = get_option( 'neliosr_recording_status', false );
		return new WP_REST_Response( $status, 200 );
	}//end get_recording_status()

	public function set_recording_status( $request ) {
		$status = $request['status'];

		if ( $status ) {
			update_option( 'neliosr_recording_status', $status );
		} else {
			delete_option( 'neliosr_recording_status' );
		}//end if

		return new WP_REST_Response( 'OK', 200 );
	}//end set_recording_status()

}//end class
