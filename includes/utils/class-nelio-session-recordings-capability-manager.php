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
class Nelio_Session_Recordings_Capability_Manager {

	/**
	 * The single instance of this class.
	 *
	 * @since  1.0.0
	 * @access protected
	 * @var    Nelio_Session_Recordings_Capability_Manager
	 */
	protected static $instance;

	/**
	 * Returns the single instance of this class.
	 *
	 * @return Nelio_Session_Recordings_Capability_Manager the single instance of this class.
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

	public function init() {
		$main_file = neliosr_instance()->plugin_path . '/nelio-session-recordings.php';
		register_activation_hook( $main_file, array( $this, 'add_capabilities' ) );
		register_deactivation_hook( $main_file, array( $this, 'remove_capabilities' ) );

		add_filter( 'ure_capabilities_groups_tree', array( $this, 'add_ure_group' ) );
		add_filter( 'ure_custom_capability_groups', array( $this, 'add_neliosr_capabilities_to_ure_group' ), 10, 2 );
	}//end init()

	/**
	 * Adds custom Nelio Session Recordings’ capabilities from admin admin and editor roles.
	 *
	 * @since 1.0.0
	 */
	public function add_capabilities() {
		$roles = array( 'administrator', 'editor' );
		foreach ( $roles as $role_name ) {
			$role = get_role( $role_name );
			if ( $role ) {
				$caps = $this->get_role_capabilities( $role_name );
				foreach ( $caps as $cap ) {
					$role->add_cap( $cap );
				}//end foreach
			}//end if
		}//end foreach
	}//end add_capabilities()

	/**
	 * Removes custom Nelio Session Recordings’ capabilities from admin admin and editor roles.
	 *
	 * @since 1.0.0
	 */
	public function remove_capabilities() {
		$roles = array( 'administrator', 'editor' );
		foreach ( $roles as $role_name ) {
			$role = get_role( $role_name );
			if ( $role ) {
				$caps = $this->get_role_capabilities( $role_name );
				foreach ( $caps as $cap ) {
					$role->remove_cap( $cap );
				}//end foreach
			}//end if
		}//end foreach
	}//end remove_capabilities()

	/**
	 * Returns all the custom capabilities defined by Nelio Session Recordings.
	 *
	 * @return array list of capabilities
	 *
	 * @since 1.0.0
	 */
	public function get_all_capabilities() {
		return $this->get_role_capabilities( 'administrator' );
	}//end get_all_capabilities()

	/**
	 * Adds Nelio Session Recordings group in User Role Editor plugin.
	 *
	 * @param array $groups List of groups.
	 *
	 * @return array List of groups with Nelio Session Recordings group.
	 *
	 * @since 6.0.1
	 */
	public function add_ure_group( $groups ) {
		$groups['nelio_session_recordings'] = array(
			'caption' => 'Nelio Session Recordings',
			'parent'  => 'custom',
			'level'   => 2,
		);
		return $groups;
	}//end add_ure_group()

	/**
	 * Adds Nelio Session Recordings capabilities in our own group in User Role Editor plugin.
	 *
	 * @param array  $groups      List of groups.
	 * @param string $capability Capability ID.
	 *
	 * @return array List of groups where the given capability belongs to.
	 *
	 * @since 1.0.0
	 */
	public function add_neliosr_capabilities_to_ure_group( $groups, $capability ) {
		if ( false !== strpos( $capability, '_neliosr_' ) ) {
			$groups[] = 'nelio_session_recordings';
		}//end if
		return $groups;
	}//end add_neliosr_capabilities_to_ure_group()

	private function get_role_capabilities( $role ) {
		$editor_caps = array(
			// Basic recording management.
			'edit_neliosr_recordings',
			'delete_neliosr_recordings',

			// Manage recordings status.
			'start_neliosr_recordings',
			'stop_neliosr_recordings',

			// View results.
			'read_neliosr_recordings',

			// Manage settings.
			'manage_neliosr_options',
		);

		$admin_caps = array_merge(
			$editor_caps,
			array( 'manage_neliosr_account' )
		);

		$caps = array(
			'administrator' => $admin_caps,
			'editor'        => $editor_caps,
		);

		return isset( $caps[ $role ] ) ? $caps[ $role ] : array();
	}//end get_role_capabilities()

}//end class
