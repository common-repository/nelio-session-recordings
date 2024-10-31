<?php
/**
 * This file defines the user interface for a session recording.
 *
 * @since 1.0.0
 */

defined( 'ABSPATH' ) || exit;

/**
 * Session recording page.
 */
class Nelio_Session_Recordings_Recording_Page extends Nelio_Session_Recordings_Abstract_Page {

	public function __construct() {

		parent::__construct(
			'nelio-session-recordings',
			_x( 'View Recording', 'text', 'nelio-session-recordings' ),
			neliosr_is_integrated_to_nab() ?
				_x( 'Recordings', 'text', 'nelio-session-recordings' ) :
				_x( 'All Recordings', 'text', 'nelio-session-recordings' ),
			'read_neliosr_recordings',
			'nelio-session-recordings-viewer'
		);

	}//end __construct()

	// @Overrides
	// phpcs:ignore
	public function init() {

		parent::init();

		add_action( 'admin_menu', array( $this, 'maybe_remove_this_page_from_the_menu' ), 999 );
		add_action( 'current_screen', array( $this, 'maybe_redirect_to_recordings_page' ) );
		add_action( 'current_screen', array( $this, 'die_if_params_are_invalid' ) );

		add_filter(
			'neliosr_script_dependencies',
			function( $dependencies, $handle ) {
				if ( 'neliosr-recording-page' !== $handle ) {
					return $dependencies;
				}//end if

				$dependencies[] = 'jquery-ui-tooltip';
				return $dependencies;
			},
			10,
			2
		);

	}//end init()

	public function maybe_redirect_to_recordings_page() {

		if ( ! $this->is_current_screen_this_page() ) {
			return;
		}//end if

		if ( ! $this->does_request_have_a_recording() ) {
			wp_safe_redirect( admin_url( 'admin.php?page=nelio-session-recordings' ) );
			exit;
		}//end if

	}//end maybe_redirect_to_recordings_page()

	public function maybe_remove_this_page_from_the_menu() {

		if ( ! $this->is_current_screen_this_page() ) {
			$this->remove_this_page_from_the_menu();
		} else {
			$this->remove_recordings_list_from_menu();
		}//end if

	}//end maybe_remove_this_page_from_the_menu()

	public function die_if_params_are_invalid() {

		if ( ! $this->is_current_screen_this_page() ) {
			return;
		}//end if

	}//end die_if_params_are_invalid()

	// @Implements
	// phpcs:ignore
	public function enqueue_assets() {

		$script = '( function() { wp.domReady( function() { neliosr.initPage( "recording", %s ); } ); } )();';

		if ( ! isset( $_GET['recording'] ) ) { // phpcs:ignore
			return;
		}//end if

		$settings = array(
			'recording'      => sanitize_text_field( $_GET['recording'] ), // phpcs:ignore
			'clickAudioFile' => neliosr_instance()->plugin_url . '/assets/dist/audio/click.wav',
		);

		wp_enqueue_style(
			'neliosr-recording-page',
			neliosr_instance()->plugin_url . '/assets/dist/css/recording-page.css',
			array( 'neliosr-components' ),
			neliosr_instance()->plugin_version
		);
		neliosr_enqueue_script_with_auto_deps( 'neliosr-recording-page', 'recording-page', true );

		wp_add_inline_script(
			'neliosr-recording-page',
			sprintf(
				$script,
				wp_json_encode( $settings ) // phpcs:ignore
			)
		);

	}//end enqueue_assets()

	// @Implements
	// phpcs:ignore
	public function display() {
		$title = $this->page_title;
		// phpcs:ignore
		include neliosr_instance()->plugin_path . '/admin/views/nelio-session-recordings-recording-page.php';
	}//end display()

	private function does_request_have_a_recording() {

		return isset( $_GET['recording'] ); // phpcs:ignore

	}//end does_request_have_a_recording()

	private function remove_this_page_from_the_menu() {

		$this->remove_page_from_menu( neliosr_is_integrated_to_nab() ? 'nelio-ab-testing' : 'nelio-session-recordings', $this->menu_slug );

	}//end remove_this_page_from_the_menu()

	private function remove_recordings_list_from_menu() {

		$this->remove_page_from_menu( neliosr_is_integrated_to_nab() ? 'nelio-ab-testing' : 'nelio-session-recordings', 'nelio-session-recordings' );

	}//end remove_recordings_list_from_menu()

}//end class
