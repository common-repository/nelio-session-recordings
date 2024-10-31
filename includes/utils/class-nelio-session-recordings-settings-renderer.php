<?php
/**
 * This file has the Settings class, which defines and registers Nelio Session Recording's Settings.
 *
 * @since 1.0.0
 */

defined( 'ABSPATH' ) || exit;

/**
 * The Settings Renderer class, responsible of rendering all Nelio Session Recording's settings.
 *
 * @since 1.0.0
 */
final class Nelio_Session_Recordings_Settings_Renderer {
	/**
	 * The single instance of this class.
	 *
	 * @since  1.0.0
	 * @access protected
	 * @var    Nelio_Session_Recordings_Settings_Renderer
	 */
	private static $instance;

	/**
	 * Returns the single instance of this class.
	 *
	 * @return Nelio_Session_Recordings_Settings_Renderer the single instance of this class.
	 *
	 * @since  1.0.0
	 * @access public
	 */
	public static function instance() {
		self::$instance = is_null( self::$instance ) ? new self() : self::$instance;
		return self::$instance;
	}//end instance()

	public function init() {
		add_filter( 'nab_tab_settings', array( $this, 'maybe_add_additional_tab' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
		add_action( 'nab_settings_screen_after', array( $this, 'display' ) );
	}//end init()

	public function maybe_add_additional_tab( $tabs ) {
		if ( neliosr_is_integrated_to_nab() ) {
			array_push(
				$tabs,
				array(
					'name'   => 'recordings',
					'label'  => _x( 'Recordings', 'text (settings tab)', 'nelio-session-recordings' ),
					'custom' => true,
				)
			);
		}//end if

		return $tabs;
	}//end maybe_add_additional_tab()

	public function enqueue_scripts() {
		if ( neliosr_is_integrated_to_nab() && ! $this->is_nab_settings_screen_this_page() ) {
			return;
		}//end if

		if ( ! neliosr_is_integrated_to_nab() && ! $this->is_recordings_settings_screen_this_page() ) {
			return;
		}//end if

		$script = '( function() { wp.domReady( function() { neliosr.initPage( "settings", %s ); } ); } )();';

		wp_enqueue_style(
			'neliosr-settings-page',
			neliosr_instance()->plugin_url . '/assets/dist/css/settings-page.css',
			array( 'neliosr-components' ),
			neliosr_instance()->plugin_version
		);
		neliosr_enqueue_script_with_auto_deps( 'neliosr-settings-page', 'settings-page', true );

		$settings = Nelio_Session_Recordings_Settings::instance();
		wp_add_inline_script(
			'neliosr-settings-page',
			sprintf(
				$script,
				wp_json_encode(
					array_merge(
						$settings->json(),
						array(
							'hideTitle'   => $this->is_nab_settings_screen_this_page(),
							'isNabActive' => neliosr_is_nab_active(),
						)
					)
				)
			)
		);
	}//end enqueue_scripts()

	public function display() {
		include neliosr_instance()->plugin_path . '/admin/views/nelio-session-recordings-settings-page.php';
	}//end display()

	protected function is_nab_settings_screen_this_page() {
		return (
			isset( $_GET['page'] ) && // phpcs:ignore
			sanitize_text_field( $_GET['page'] ) === 'nelio-ab-testing-settings' && // phpcs:ignore
			isset( $_GET['tab'] ) && // phpcs:ignore
			sanitize_text_field( $_GET['tab'] ) === 'recordings' // phpcs:ignore
		);
	}//end is_nab_settings_screen_this_page()

	protected function is_recordings_settings_screen_this_page() {
		return (
			isset( $_GET['page'] ) && // phpcs:ignore
			sanitize_text_field( $_GET['page'] ) === 'nelio-session-recordings-settings' // phpcs:ignore
		);
	}//end is_recordings_settings_screen_this_page()

}//end class
