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
class Nelio_Session_Recordings_Main_Script {

	protected static $instance;

	public static function instance() {

		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}//end if

		return self::$instance;

	}//end instance()

	public function init() {
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_script' ), 1 );
		add_filter( 'script_loader_tag', array( $this, 'add_extra_script_attributes' ), 10, 2 );
	}//end init()

	public function add_extra_script_attributes( $tag, $handle ) {
		if ( 'nelio-session-recordings-main' !== $handle ) {
			return $tag;
		}//end if
		$attrs = neliosr_get_extra_script_attributes();
		$tag   = empty( $attrs ) ? $tag : str_replace( '></script>', " {$attrs}></script>", $tag ); // phpcs:ignore
		return $tag;
	}//end add_extra_script_attributes()

	public function enqueue_script() {
		if ( neliosr_is_session_recording_disabled() ) {
			return;
		}//end if

		$plugin_settings = Nelio_Session_Recordings_Settings::instance();

		$settings = array(
			'api'                => $this->get_api_settings(),
			'isStagingSite'      => neliosr_is_staging(),
			'monthlyQuota'       => neliosr_get_monthly_quota(),
			'site'               => neliosr_get_site_id(),
			'trackShortSessions' => $plugin_settings->track_short_sessions,
			'samplingRate'       => $plugin_settings->sampling_rate,
			'gdprCookie'         => $this->get_gdpr_cookie(),
			'recordingsScope'    => $plugin_settings->recordings_scope,
		);

		/**
		 * Filters main public script settings.
		 *
		 * @param object $settings public script settings.
		 *
		 * @since 1.0.0
		 */
		$settings = apply_filters( 'neliosr_main_script_settings', $settings );

		neliosr_enqueue_script_with_auto_deps( 'nelio-session-recordings-main', 'public' );
		wp_add_inline_script(
			'nelio-session-recordings-main',
			sprintf( 'window.neliosrSettings=%s;', wp_json_encode( $settings ) ),
			'before'
		);
	}//end enqueue_script()

	private function get_api_settings() {
		return array(
			'mode' => 'native',
			'url'  => neliosr_get_api_url( '', 'browser' ),
		);
	}//end get_api_settings()

	private function get_gdpr_cookie() {

		$plugin_settings = Nelio_Session_Recordings_Settings::instance();
		$cookie_settings = $plugin_settings->gdpr_cookie;

		if ( $cookie_settings['customize'] ) {
			return array(
				'name'  => is_string( $cookie_settings['name'] ) ? $cookie_settings['name'] : '',
				'value' => is_string( $cookie_settings['value'] ) ? $cookie_settings['value'] : '',
			);
		}//end if

		if ( neliosr_is_nab_active() && class_exists( 'Nelio_AB_Testing_Settings' ) ) {
			$settings = Nelio_AB_Testing_Settings::instance();
			$cookie   = $settings->get( 'gdpr_cookie_setting' );
			$cookie   = is_array( $cookie ) ? $cookie : array(
				'name'  => '',
				'value' => '',
			);

			if ( ! empty( $cookie['name'] ) ) {
				return $cookie;
			}//end if

			$name           = apply_filters( 'nab_gdpr_cookie', false );
			$name           = empty( $name ) ? '' : trim( $name );
			$cookie['name'] = $name;
			return $cookie;
		}//end if

		return array(
			'name'  => '',
			'value' => '',
		);
	}//end get_gdpr_cookie()

}//end class
