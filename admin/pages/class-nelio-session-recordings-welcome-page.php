<?php
/**
 * This file adds the page to welcome nwe users and starts the render process.
 *
 * @since 5.0.0
 */

defined( 'ABSPATH' ) || exit;

/**
 * Class that adds the welcome page.
 */
class Nelio_Session_Recordings_Welcome_Page extends Nelio_Session_Recordings_Abstract_Page {

	public function __construct() {

		parent::__construct(
			'nelio-session-recordings',
			_x( 'Welcome', 'text', 'nelio-session-recordings' ),
			_x( 'Welcome', 'text', 'nelio-session-recordings' ),
			'manage_neliosr_account',
			'nelio-session-recordings'
		);

	}//end __construct()

	// @Implements
	// phpcs:ignore
	public function enqueue_assets() {
		wp_enqueue_style(
			'neliosr-welcome-page',
			neliosr_instance()->plugin_url . '/assets/dist/css/welcome-page.css',
			array( 'neliosr-components' ),
			neliosr_instance()->plugin_version
		);
		neliosr_enqueue_script_with_auto_deps( 'neliosr-welcome-page', 'welcome-page', true );
	}//end enqueue_assets()

	// @Implements
	// phpcs:ignore
	public function display() { ?>
		<div class="wrap">
			<h1 class="wp-heading-inline screen-reader-text"><?php echo esc_html( $this->page_title ); ?></h1>
			<div class="notice notice-error notice-alt hide-if-js">
				<p>
				<?php
					echo esc_html_x( 'This page requires JavaScript. Please enable JavaScript in your browser settings.', 'user', 'nelio-session-recordings' );
				?>
				</p>
			</div>
			<div id="neliosr-welcome" class="neliosr-welcome-container hide-if-no-js"></div>
		</div>
		<?php
	}//end display()

}//end class
