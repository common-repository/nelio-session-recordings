<?php
/**
 * The public-facing functionality of the plugin.
 *
 * @since 1.0.0
 */

defined( 'ABSPATH' ) || exit;

/**
 * The public-facing functionality of the plugin.
 */
class Nelio_Session_Recordings_Public {

	protected static $instance;

	public static function instance() {

		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}//end if

		return self::$instance;

	}//end instance()

	public function init() {

		add_action( 'plugins_loaded', array( $this, 'maybe_init_session_recording' ) );

		add_action( 'init', array( $this, 'update_user_session_cookies' ) );
		add_action( 'set_logged_in_cookie', array( $this, 'set_user_session_cookies' ), 10, 4 );
		add_action( 'clear_auth_cookie', array( $this, 'clear_user_session_cookies' ) );

		add_action( 'plugins_loaded', array( $this, 'neliosr_public_init' ), 9999 );

	}//end init()

	public function neliosr_public_init() {
		/**
		 * Initializes the public facet of the plugin.
		 *
		 * Fires right after WordPress’ `plugins_loaded` action with a low priority
		 * (so that other plugins can hook into `neliosr_public_init` during `plugins_loaded`).
		 *
		 * @since 1.0.0
		 */
		do_action( 'neliosr_public_init' );
	}//end neliosr_public_init()

	public function set_user_session_cookies( $_, $__, $expiration, $user_id ) {
		// phpcs:ignore
		setcookie( 'neliosrIsUserLoggedIn', 'true', $expiration, '/' );

		if ( ! $this->is_visitor_recorded( $user_id ) ) {
			// phpcs:ignore
			setcookie( 'neliosrIsVisitorExcluded', 'true', $expiration, '/' );
		} else {
			// phpcs:ignore
			setcookie( 'neliosrIsVisitorExcluded', 'true', time() - YEAR_IN_SECONDS, '/' );
		}//end if
	}//end set_user_session_cookies()

	public function update_user_session_cookies() {
		if ( isset( $_COOKIE['neliosrIsUserLoggedIn'] ) && isset( $_COOKIE['neliosrIsVisitorExcluded'] ) ) {
			return;
		}//end if

		$user_id = get_current_user_id();
		if ( empty( $user_id ) ) {
			return;
		}//end if

		$this->set_user_session_cookies( null, null, time() + DAY_IN_SECONDS, $user_id );
	}//end update_user_session_cookies()

	public function clear_user_session_cookies() {
		// phpcs:ignore
		setcookie( 'neliosrIsUserLoggedIn', 'true', time() - YEAR_IN_SECONDS, '/' );
		// phpcs:ignore
		setcookie( 'neliosrIsVisitorExcluded', 'true', time() - YEAR_IN_SECONDS, '/' );
	}//end clear_user_session_cookies()

	public function maybe_init_session_recording() {
		if ( neliosr_is_session_recording_disabled() ) {
			return;
		}//end if

		$aux = Nelio_Session_Recordings_Main_Script::instance();
		$aux->init();
	}//end maybe_init_session_recording()

	private function is_visitor_recorded( $user_id ) {
		$is_visitor_recorded = true;

		if ( is_super_admin( $user_id ) ) {
			$is_visitor_recorded = false;
		} elseif ( user_can( $user_id, 'edit_neliosr_recordings' ) ) {
			$is_visitor_recorded = false;
		} elseif ( user_can( $user_id, 'read_neliosr_recordings' ) ) {
			$is_visitor_recorded = false;
		}//end if

		/**
		 * Whether the user related to the current request should be recorded or not.
		 *
		 * With this filter, you can decide if the current user participates in your recordings or not.
		 * By default, all users are recorded except those that have (at least) an `editor` role.
		 *
		 * **Notice.** Our plugin uses JavaScript to record sessions. Be careful when limiting recordings
		 * in PHP, as it’s possible that your cache or CDN ends up caching these limitations and, as a result,
		 * none of your visitors are recorded.
		 *
		 * @param boolean $is_visitor_recorded whether the user related to the current request should be recorded or not.
		 * @param int     $user_id           ID of the visitor.
		 *
		 * @since 1.2.0
		 * @since 1.2.0 The `$user_id` param has been added.
		 */
		return apply_filters( 'neliosr_is_visitor_recorded', $is_visitor_recorded, $user_id );
	}//end is_visitor_recorded()

}//end class
