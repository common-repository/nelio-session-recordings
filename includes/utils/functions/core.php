<?php
/**
 * Nelio Session Recordings core functions.
 *
 * @since 1.0.0
 */

defined( 'ABSPATH' ) || exit;

/**
 * Returns this site's ID.
 *
 * @return string This site's ID. This option is used for accessing AWS.
 *
 * @since 1.0.0
 */
function neliosr_get_site_id() {
	if ( neliosr_is_integrated_to_nab() ) {
		return function_exists( 'nab_get_site_id' )
			? nab_get_site_id()
			: false;
	}//end if

	return get_option( 'neliosr_site_id', false );
}//end neliosr_get_site_id()
