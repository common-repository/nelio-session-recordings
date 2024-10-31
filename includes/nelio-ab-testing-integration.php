<?php
/**
 * Hooks to integrate with Nelio A/B Testing.
 *
 * @since 1.0.0
 */

defined( 'ABSPATH' ) || exit;

add_action(
	'nab_site_updated',
	function( $site ) {
		if ( neliosr_get_site_id() === $site['id'] ) {
			set_transient( 'neliosr_site_object', $site, HOUR_IN_SECONDS / 2 );
		}//end if
	}
);

add_filter(
	'nab_show_session_recordings_page',
	'__return_false'
);

add_filter(
	'neliosr_script_dependencies',
	function( $dependencies, $handle ) {
		if ( ! neliosr_is_nab_active() ) {
			return $dependencies;
		}//end if

		if ( 'neliosr-data' !== $handle ) {
			return $dependencies;
		}//end if

		$dependencies[] = 'nab-experiment-library';
		return $dependencies;
	},
	10,
	2
);
