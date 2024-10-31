<?php
/**
 * This file defines the user interface for the settings.
 *
 * @since 1.0.0
 */

defined( 'ABSPATH' ) || exit;

/**
 * This class contains several methods for the list of session recordings.
 *
 * @since 1.0.0
 */
class Nelio_Session_Recordings_Settings_Page extends Nelio_Session_Recordings_Abstract_Page {

	public function __construct() {

		parent::__construct(
			'nelio-session-recordings',
			_x( 'Settings', 'text', 'nelio-session-recordings' ),
			_x( 'Settings', 'text', 'nelio-session-recordings' ),
			'edit_neliosr_recordings',
			'nelio-session-recordings-settings'
		);

	}//end __construct()

	// @Overrides
	// phpcs:ignore
	public function init() {

		parent::init();

		add_action( 'admin_menu', array( $this, 'maybe_remove_settings_page_from_the_menu' ), 999 );

	}//end init()

	public function maybe_remove_settings_page_from_the_menu() {

		if ( neliosr_is_integrated_to_nab() ) {
			$this->remove_page_from_menu( 'nelio-ab-testing', 'nelio-session-recordings-settings' );
		}//end if

	}//end maybe_remove_settings_page_from_the_menu()

	public function enqueue_assets() {

		$aux = new Nelio_Session_Recordings_Settings_Renderer();
		$aux->enqueue_scripts();

	}//end enqueue_assets()

	public function display() {

		$aux = new Nelio_Session_Recordings_Settings_Renderer();
		$aux->display();

	}//end display()

}//end class
