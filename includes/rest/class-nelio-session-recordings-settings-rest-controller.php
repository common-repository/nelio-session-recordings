<?php
/**
 * This file contains the class that defines REST API endpoints for
 * managing a Nelio Session Recordings.
 *
 * @since 1.0.0
 */

defined( 'ABSPATH' ) || exit;

class Nelio_Session_Recordings_Settings_REST_Controller extends WP_REST_Controller {

	/**
	 * The single instance of this class.
	 *
	 * @since  1.0.0
	 * @access protected
	 * @var    Nelio_Session_Recordings_Settings_REST_Controller
	 */
	protected static $instance;

	/**
	 * Returns the single instance of this class.
	 *
	 * @return Nelio_Session_Recordings_Settings_REST_Controller the single instance of this class.
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
			'/settings',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'save_settings' ),
					'permission_callback' => neliosr_capability_checker( 'manage_neliosr_options' ),
					'args'                => array(
						'settings' => array(
							'required'          => true,
							'validate_callback' => function( $param ) {
								return is_array( $param );
							},
						),
					),
				),
			)
		);

	}//end register_routes()

	/**
	 * Saves the settings.
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_REST_Response The response
	 */
	public function save_settings( $request ) {
		$settings = Nelio_Session_Recordings_Settings::instance();
		$settings->update( $request['settings'] );
		$settings->save();
		return new WP_REST_Response( 'OK', 200 );
	}//end save_settings()

}//end class
