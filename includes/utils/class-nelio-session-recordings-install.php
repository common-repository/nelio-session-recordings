<?php
/**
 * The file that includes installation-related functions and actions.
 *
 * @since 1.0.0
 */

defined( 'ABSPATH' ) || exit;

/**
 * This class configures WordPress and installs some capabilities.
 *
 * @since 1.0.0
 */
class Nelio_Session_Recordings_Install {

	/**
	 * The single instance of this class.
	 *
	 * @since  1.0.0
	 * @access protected
	 * @var    Nelio_Session_Recordings_Install
	 */
	protected static $instance;

	/**
	 * Returns the single instance of this class.
	 *
	 * @return Nelio_Session_Recordings_Install the single instance of this class.
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
	 * Hook in tabs.
	 *
	 * @since  1.0.0
	 * @access public
	 */
	public function init() {

		$main_file = neliosr_instance()->plugin_path . '/nelio-session-recordings.php';
		register_activation_hook( $main_file, array( $this, 'install' ) );
		register_deactivation_hook( $main_file, array( $this, 'uninstall' ) );

	}//end init()

	/**
	 * Install Nelio Session Recordings.
	 *
	 * This function registers new post types, adds a few capabilities, and more.
	 *
	 * @since  1.0.0
	 * @access public
	 */
	public function install() {

		if ( ! defined( 'NELIOSR_INSTALLING' ) ) {
			define( 'NELIOSR_INSTALLING', true );
		}//end if

		/**
		 * Fires once the plugin has been installed.
		 *
		 * @since 1.0.0
		 */
		do_action( 'neliosr_installed' );

	}//end install()

	/**
	 * Deactivate and uninstall Nelio Session Recordings.
	 *
	 * This function is run when the plugin is deactivated.
	 *
	 * @since  1.0.0
	 * @access public
	 */
	public function uninstall() {
		if ( ! defined( 'NELIO_SESSION_RECORDINGS_UNINSTALLING' ) ) {
			define( 'NELIO_SESSION_RECORDINGS_UNINSTALLING', true );
		}//end if

		/**
		 * Fires once the plugin has been installed.
		 *
		 * @since 1.0.0
		 */
		do_action( 'neliosr_installed' );

	}//end uninstall()

}//end class
