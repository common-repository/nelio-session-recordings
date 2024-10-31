<?php
/**
 * The plugin bootstrap file
 *
 * @wordpress-plugin
 * Plugin Name:       Nelio Session Recordings
 * Plugin URI:        https://neliosoftware.com/session-recordings/
 * Description:       Highlights visual and logical reasons why your visitors are not turning into customers. With this plugin, you will be able to record the sessions of your visitors.
 * Version:           1.4.0
 *
 * Author:            Nelio Software
 * Author URI:        https://neliosoftware.com
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 *
 * Text Domain:       nelio-session-recordings
 */

defined( 'ABSPATH' ) || exit;

define( 'NELIO_SESSION_RECORDINGS', true );

function neliosr_instance() {
	return Nelio_Session_Recordings::instance();
}//end neliosr_instance()

/**
 * Main class.
 */
class Nelio_Session_Recordings {


	private static $instance = null;

	public $plugin_file;
	public $plugin_path;
	public $plugin_url;
	public $plugin_slug;
	public $plugin_name;
	public $plugin_name_sanitized;
	public $plugin_version;
	public $rest_namespace;

	public static function instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
			self::$instance->load_dependencies();
			self::$instance->install();
			self::$instance->init();
		}//end if

		return self::$instance;
	}//end instance()

	private function load_dependencies() {
		$this->plugin_path    = untrailingslashit( plugin_dir_path( __FILE__ ) );
		$this->plugin_url     = untrailingslashit( plugin_dir_url( __FILE__ ) );
		$this->plugin_file    = 'nelio-session-recordings/nelio-session-recordings.php';
		$this->rest_namespace = 'neliosr/v1';

		// phpcs:ignore
		require_once $this->plugin_path . '/vendor/autoload.php';
		// phpcs:ignore
		require_once $this->plugin_path . '/includes/utils/functions/api.php';
		// phpcs:ignore
		require_once $this->plugin_path . '/includes/utils/functions/array.php';
		// phpcs:ignore
		require_once $this->plugin_path . '/includes/utils/functions/core.php';
		// phpcs:ignore
		require_once $this->plugin_path . '/includes/utils/functions/helpers.php';
		// phpcs:ignore
		require_once $this->plugin_path . '/includes/utils/functions/subscription.php';
		// phpcs:ignore
		require_once $this->plugin_path . '/includes/nelio-ab-testing-integration.php';

	}//end load_dependencies()

	private function install() {
		add_action( 'plugins_loaded', array( $this, 'load_i18n_strings' ), 1 );
		add_action( 'plugins_loaded', array( $this, 'plugin_data_init' ), 1 );

		$aux = Nelio_Session_Recordings_Install::instance();
		$aux->init();

		$aux = Nelio_Session_Recordings_Capability_Manager::instance();
		$aux->init();

		if ( is_admin() && ! wp_doing_ajax() ) {
			$aux = Nelio_Session_Recordings_Admin::instance();
			$aux->init();
		}//end if
	}//end install()

	private function init() {
		if ( ! $this->is_ready() ) {
			$aux = Nelio_Session_Recordings_Init_REST_Controller::instance();
			$aux->init();
			return;
		}//end if

		add_action( 'admin_init', array( $this, 'add_privacy_policy' ) );

		$this->init_rest_controllers();

		if ( ! is_admin() ) {
			$aux = Nelio_Session_Recordings_Public::instance();
			$aux->init();
		}//end if
	}//end init()

	public function is_ready() {
		return ! empty( neliosr_get_site_id() );
	}//end is_ready()

	private function init_rest_controllers() {
		$aux = Nelio_Session_Recordings_Account_REST_Controller::instance();
		$aux->init();

		$aux = Nelio_Session_Recordings_Recording_REST_Controller::instance();
		$aux->init();

		$aux = Nelio_Session_Recordings_Settings_REST_Controller::instance();
		$aux->init();

		$aux = Nelio_Session_Recordings_Post_REST_Controller::instance();
		$aux->init();

		$aux = Nelio_Session_Recordings_Experiment_REST_Controller::instance();
		$aux->init();

		$aux = Nelio_Session_Recordings_Plugin_REST_Controller::instance();
		$aux->init();
	}//end init_rest_controllers()

	public function load_i18n_strings() {
		load_plugin_textdomain( 'nelio-session-recordings', false, basename( $this->plugin_path ) . '/languages/' );
	}//end load_i18n_strings()

	public function plugin_data_init() {
		$data = get_file_data( __FILE__, array( 'Plugin Name', 'Version' ), 'plugin' );

		$this->plugin_name           = $data[0];
		$this->plugin_version        = $data[1];
		$this->plugin_slug           = plugin_basename( __FILE__, '.php' );
		$this->plugin_name_sanitized = basename( __FILE__, '.php' );
	}//end plugin_data_init()

	public function add_privacy_policy() {
		if ( ! function_exists( 'wp_add_privacy_policy_content' ) ) {
			return;
		}//end if

		ob_start();
		// phpcs:ignore
		include neliosr_instance()->plugin_path . '/includes/data/privacy-policy.php';
		$content = ob_get_contents();
		ob_end_clean();

		/**
		 * Filters the content of Nelio Session Recordings’ privacy policy.
		 *
		 * The suggested text is a proposal that should be included in the site’s
		 * privacy policy. It contains information about how the plugin works, what
		 * information is stored in Nelio’s clouds, which cookies are used, etc.
		 *
		 * The text will be shown on the Privacy Policy Guide screen.
		 *
		 * @param string $content the content of Nelio Session Recordings’ privacy policy.
		 *
		 * @since 1.0.0
		 */
		$content = wp_kses_post( apply_filters( 'neliosr_privacy_policy_content', wpautop( $content ) ) );
		wp_add_privacy_policy_content( 'Nelio Session Recordings', $content );
	}//end add_privacy_policy()

}//end class

// Start plugin.
neliosr_instance();
