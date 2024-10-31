<?php
/**
 * Abstract class that implements a page.
 *
 * @since 1.0.0
 */

defined( 'ABSPATH' ) || exit;

/**
 * A class that represents a page.
 */
abstract class Nelio_Session_Recordings_Abstract_Page {

	protected $parent_slug;
	protected $page_title;
	protected $menu_title;
	protected $capability;
	protected $menu_slug;
	protected $mode;

	public function __construct( string $parent_slug, string $page_title, string $menu_title, string $capability, string $menu_slug, string $mode = 'regular-page' ) {

		$this->parent_slug = $parent_slug;
		$this->page_title  = $page_title;
		$this->menu_title  = $menu_title;
		$this->capability  = $capability;
		$this->menu_slug   = $menu_slug;
		$this->mode        = $mode;

	}//end __construct()

	public function init() {

		$this->add_page();
		add_action( 'admin_enqueue_scripts', array( $this, 'maybe_enqueue_assets' ) );

	}//end init()

	public function add_page() {

		$parent_slug = neliosr_is_integrated_to_nab() ? 'nelio-ab-testing' : $this->parent_slug;

		add_submenu_page(
			$parent_slug,
			$this->page_title,
			$this->menu_title,
			$this->capability,
			$this->menu_slug,
			$this->get_render_function(),
			3
		);

	}//end add_page()

	abstract public function display();

	public function maybe_enqueue_assets() {

		if ( ! $this->is_current_screen_this_page() ) {
			return;
		}//end if

		$this->enqueue_assets();

	}//end maybe_enqueue_assets()

	abstract protected function enqueue_assets();

	private function get_render_function() {

		switch ( $this->mode ) {

			case 'extends-existing-page':
				return null;

			case 'regular-page':
			default:
				return array( $this, 'display' );

		}//end switch

	}//end get_render_function()

	protected function remove_page_from_menu( $parent, $slug ) {

		global $submenu;
		if ( ! isset( $submenu[ $parent ] ) ) {
			return;
		}//end if

		$submenu[ $parent ] = array_filter( // phpcs:ignore
			$submenu[ $parent ],
			function( $item ) use ( $slug ) {
				return $item[2] !== $slug;
			}//end if
		);

	}//end remove_page_from_menu()

	protected function is_current_screen_this_page() {
		return (
			isset( $_GET['page'] ) && // phpcs:ignore
			sanitize_text_field( $_GET['page'] ) === $this->menu_slug // phpcs:ignore
		);
	}//end is_current_screen_this_page()

}//end class
