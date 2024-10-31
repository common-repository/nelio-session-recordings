<?php
/**
 * A REST API Endpoint to initialize the plugin.
 *
 * @since 1.0.0
 */

defined( 'ABSPATH' ) || exit;

class Nelio_Session_Recordings_Init_REST_Controller extends WP_REST_Controller {

	/**
	 * The single instance of this class.
	 *
	 * @since  1.0.0
	 * @access protected
	 * @var    Nelio_Session_Recordings_Init_REST_Controller
	 */
	protected static $instance;

	/**
	 * Returns the single instance of this class.
	 *
	 * @return Nelio_Session_Recordings_Init_REST_Controller the single instance of this class.
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
			'/init-site',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'init_site' ),
					'permission_callback' => neliosr_capability_checker( 'manage_neliosr_options' ),
					'args'                => array(
						'license' => array(
							'required'          => true,
							'sanitize_callback' => 'sanitize_text_field',
						),
					),
				),
			)
		);

	}//end register_routes()

	/**
	 * Initializes this site in Nelio’s cloud.
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_REST_Response The response
	 */
	public function init_site( $request ) {
		if ( neliosr_get_site_id() ) {
			return new WP_REST_Response( true, 200 );
		}//end if

		$license = $request->get_param( 'license' );

		$params = array(
			'id'          => neliosr_uuid(),
			'url'         => home_url(),
			'language'    => neliosr_get_language(),
			'timezone'    => neliosr_get_timezone(),
			'wpVersion'   => get_bloginfo( 'version' ),
			'license'     => $license,
			'productType' => 'nsr',
		);

		$data = array(
			'method'    => 'POST',
			'timeout'   => apply_filters( 'neliosr_request_timeout', 30 ),
			'sslverify' => ! neliosr_does_api_use_proxy(),
			'headers'   => array(
				'accept'       => 'application/json',
				'content-type' => 'application/json',
			),
			'body'      => wp_json_encode( $params ),
		);

		$url      = neliosr_get_api_url( '/site/subscription', 'wp' );
		$response = wp_remote_request( $url, $data );

		// If the response is an error, leave.
		$error = neliosr_maybe_return_error_json( $response );
		if ( $error ) {
			return new WP_Error( 'unknown-error', "Invalid license $license." );
		}//end if

		// Regenerate the account result and send it to the JS.
		$site_info = json_decode( $response['body'], true );
		update_option( 'neliosr_site_id', $site_info['id'] );
		update_option( 'neliosr_api_secret', $site_info['secret'] );
		update_option( 'neliosr_subscription', 'yes' );

		return new WP_REST_Response( true, 200 );
	}//end init_site()

}//end class
