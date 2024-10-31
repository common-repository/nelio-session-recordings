<?php
/**
 * The admin-specific functionality of the plugin.
 *
 * @since 1.0.0
 */

defined( 'ABSPATH' ) || exit;

/**
 * The admin-specific functionality of the plugin.
 */
class Nelio_Session_Recordings_Admin {

	protected static $instance;

	public static function instance() {

		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}//end if

		return self::$instance;

	}//end instance()

	public function init() {

		$aux = Nelio_Session_Recordings_Settings_Renderer::instance();
		$aux->init();

		add_action( 'admin_menu', array( $this, 'create_menu_pages' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'register_assets' ), 5 );
		add_filter( 'option_page_capability_nelio-session-recordings_group', array( $this, 'get_settings_capability' ) );

	}//end init()

	public function create_menu_pages() {

		if ( ! neliosr_is_integrated_to_nab() ) {
			add_menu_page(
				'Nelio Recordings',
				'Nelio Recordings',
				neliosr_instance()->is_ready() ? 'edit_neliosr_recordings' : 'manage_neliosr_account',
				'nelio-session-recordings',
				null,
				$this->get_plugin_icon(),
				25
			);
		}//end if

		if ( ! neliosr_instance()->is_ready() ) {
			$page = new Nelio_Session_Recordings_Welcome_Page();
			$page->init();
			return;
		}//end if

		$page = new Nelio_Session_Recordings_Recordings_List_Page();
		$page->init();

		$page = new Nelio_Session_Recordings_Recording_Page();
		$page->init();

		$page = new Nelio_Session_Recordings_Settings_Page();
		$page->init();

		$page = new Nelio_Session_Recordings_Plugin_List_Page();
		$page->init();

	}//end create_menu_pages()

	public function register_assets() {

		$url     = neliosr_instance()->plugin_url;
		$version = neliosr_instance()->plugin_version;

		$scripts = array(
			'neliosr-components',
			'neliosr-data',
			'neliosr-date',
			'neliosr-i18n',
			'neliosr-utils',
		);

		foreach ( $scripts as $script ) {
			$file_without_ext = preg_replace( '/^neliosr-/', '', $script );
			neliosr_register_script_with_auto_deps( $script, $file_without_ext, true );
		}//end foreach

		wp_add_inline_script(
			'neliosr-data',
			sprintf(
				'wp.data.dispatch( "neliosr/data" ).receivePluginSettings( %s );',
				wp_json_encode( $this->get_plugin_settings() )
			)
		);

		wp_localize_script(
			'neliosr-i18n',
			'neliosrI18n',
			array(
				'locale' => str_replace( '_', '-', get_locale() ),
			)
		);

		wp_register_style(
			'neliosr-components',
			$url . '/assets/dist/css/components.css',
			array( 'wp-admin', 'wp-components' ),
			$version
		);

	}//end register_assets()

	public function get_settings_capability() {
		return 'manage_neliosr_options';
	}//end get_settings_capability()

	private function get_plugin_icon() {

		$svg_icon_file = neliosr_instance()->plugin_path . '/assets/dist/images/logo.svg';
		if ( ! file_exists( $svg_icon_file ) ) {
			return false;
		}//end if

		return 'data:image/svg+xml;base64,' . base64_encode( file_get_contents( $svg_icon_file ) ); // phpcs:ignore

	}//end get_plugin_icon()

	private function get_plugin_settings() {
		return array(
			'homeUrl'      => home_url(),
			'adminUrl'     => admin_url(),
			'capabilities' => $this->get_neliosr_capabilities(),
			'siteId'       => neliosr_get_site_id(),
		);
	}//end get_plugin_settings()

	private function get_neliosr_capabilities() {
		$aux  = Nelio_Session_Recordings_Capability_Manager::instance();
		$caps = $aux->get_all_capabilities();
		$caps = array_filter(
			$caps,
			function( $cap ) {
				return current_user_can( $cap );
			}
		);
		return array_values( $caps );
	}//end get_neliosr_capabilities()

}//end class
