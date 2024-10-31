<?php
/**
 * This file customizes the plugin list page added by WordPress.
 *
 * @since 1.3.0
 */

defined( 'ABSPATH' ) || exit;

/**
 * This class contains several methods to customize the plugin list page added
 * by WordPress and, in particular, the actions associated with Nelio Session Recordings.
 */
class Nelio_Session_Recordings_Plugin_List_Page {

	public function init() {

		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );
		add_action( 'plugin_action_links_' . neliosr_instance()->plugin_file, array( $this, 'customize_plugin_actions' ) );

	}//end init()

	public function customize_plugin_actions( $actions ) {

		if ( ! neliosr_get_site_id() ) {
			return $actions;
		}//end if

		if ( ! neliosr_is_subscribed() ) {

			$subscribe_url = add_query_arg(
				array(
					'utm_source'   => 'nelio-session-recordings',
					'utm_medium'   => 'plugin',
					'utm_campaign' => 'free',
					'utm_content'  => 'subscribe-in-plugin-list',
				),
				neliosr_is_integrated_to_nab() ?
					_x( 'https://neliosoftware.com/testing/pricing/', 'text', 'nelio-session-recordings' ) :
					_x( 'https://neliosoftware.com/session-recordings/pricing/', 'text', 'nelio-session-recordings' )
			);

			$actions['subscribe'] = sprintf(
				'<a href="%s" target="_blank">%s</a>',
				esc_url( $subscribe_url ),
				esc_html_x( 'Subscribe', 'command', 'nelio-session-recordings' )
			);

		}//end if

		if ( isset( $actions['deactivate'] ) && current_user_can( 'deactivate_plugin', neliosr_instance()->plugin_file ) ) {
			$actions['deactivate'] = sprintf(
				'<span class="neliosr-deactivate-link">%1$s</span>',
				$actions['deactivate']
			);
		}//end if

		return $actions;

	}//end customize_plugin_actions()

	public function enqueue_assets() {

		$screen = get_current_screen();
		if ( empty( $screen ) || 'plugins' !== $screen->id ) {
			return;
		}//end if

		$settings = array(
			'isSubscribed'    => neliosr_is_subscribed(),
			'isStandalone'    => ! neliosr_is_integrated_to_nab(),
			'cleanNonce'      => wp_create_nonce( 'neliosr_clean_plugin_data_' . get_current_user_id() ),
			'deactivationUrl' => $this->get_deactivation_url(),
		);

		$script = <<<JS
		( function() {
			wp.domReady( function() {
				neliosr.initPage( %s );
			} );
		} )();
JS;

		wp_enqueue_style(
			'neliosr-plugin-list-page',
			neliosr_instance()->plugin_url . '/assets/dist/css/plugin-list-page.css',
			array( 'neliosr-components' ),
			neliosr_instance()->plugin_version
		);
		neliosr_enqueue_script_with_auto_deps( 'neliosr-plugin-list-page', 'plugin-list-page', true );

		wp_add_inline_script(
			'neliosr-plugin-list-page',
			sprintf(
				$script,
				wp_json_encode( $settings ) // phpcs:ignore
			)
		);

	}//end enqueue_assets()

	private function get_deactivation_url() {

		global $status, $page, $s;
		return add_query_arg(
			array(
				'action'        => 'deactivate',
				'plugin'        => rawurlencode( neliosr_instance()->plugin_file ),
				'plugin_status' => $status,
				'paged'         => $page,
				's'             => $s,
				'_wpnonce'      => wp_create_nonce( 'deactivate-plugin_' . neliosr_instance()->plugin_file ),
			),
			admin_url( 'plugins.php' )
		);

	}//end get_deactivation_url()

}//end class
