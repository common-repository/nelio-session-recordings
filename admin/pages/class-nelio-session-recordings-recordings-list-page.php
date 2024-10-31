<?php
/**
 * This file defines the user interface for the list of session recordings.
 *
 * @since 1.0.0
 */

defined( 'ABSPATH' ) || exit;

/**
 * This class contains several methods for the list of session recordings.
 *
 * @since 1.0.0
 */
class Nelio_Session_Recordings_Recordings_List_Page extends Nelio_Session_Recordings_Abstract_Page {

	public function __construct() {

		parent::__construct(
			'nelio-session-recordings',
			_x( 'Recordings', 'text', 'nelio-session-recordings' ),
			_x( 'Recordings', 'text', 'nelio-session-recordings' ),
			'edit_neliosr_recordings',
			'nelio-session-recordings'
		);

	}//end __construct()

	// @Overrides
	// phpcs:ignore
	public function init() {

		parent::init();

		add_action( 'admin_menu', array( $this, 'maybe_remove_recording_viewer_page_from_the_menu' ), 999 );

	}//end init()

	public function maybe_remove_recording_viewer_page_from_the_menu() {

		if ( $this->is_current_screen_this_page() && neliosr_is_integrated_to_nab() ) {
			$this->remove_page_from_menu( 'nelio-ab-testing', 'nelio-session-recordings-viewer' );
		}//end if

	}//end maybe_remove_recording_viewer_page_from_the_menu()

	public function enqueue_assets() {

		$script = '( function() { wp.domReady( function() { neliosr.initPage( "recordings-list", %s ); } ); } )();';

		$settings = array(
			'isSubscribed' => neliosr_is_subscribed(),
			'isStandalone' => ! neliosr_is_integrated_to_nab(),
		);

		wp_enqueue_style(
			'neliosr-recordings-list-page',
			neliosr_instance()->plugin_url . '/assets/dist/css/recordings-list-page.css',
			array( 'neliosr-components' ),
			neliosr_instance()->plugin_version
		);
		neliosr_enqueue_script_with_auto_deps( 'neliosr-recordings-list-page', 'recordings-list-page', true );

		wp_add_inline_script(
			'neliosr-recordings-list-page',
			sprintf(
				$script,
				wp_json_encode( $settings ) // phpcs:ignore
			)
		);

	}//end enqueue_assets()

	public function display() {
		$title = $this->page_title;
		// phpcs:ignore
		include neliosr_instance()->plugin_path . '/admin/views/nelio-session-recordings-recordings-list-page.php';
	}//end display()

}//end class
