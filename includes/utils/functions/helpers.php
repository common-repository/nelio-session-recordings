<?php
/**
 * Nelio Session Recordings helper functions to ease development.
 *
 * @since 1.0.0
 */

defined( 'ABSPATH' ) || exit;

/**
 * Returns whether the current request should be recorded or not.
 *
 * If it’s enabled, tracking events will be set. Otherwise, the public facet of Nelio Session Recordings will be disabled.
 *
 * @return boolean whether the current request should be recorded or not.
 *
 * @since 1.0.0
 */
function neliosr_is_session_recording_disabled() {

	if ( ! is_ssl() ) {
		return true;
	}//end if

	if ( isset( $_COOKIE['neliosrIsVisitorExcluded'] ) ) {
		return true;
	}//end if

	if ( ! neliosr_is_subscribed() ) {
		return true;
	}//end if

	$is_recorging_active = get_option( 'neliosr_recording_status', false );
	if ( ! $is_recorging_active ) {
		return true;
	}//end if

	/**
	 * Whether the current request should be excluded from session recording or not.
	 *
	 * If it’s enabled, tracking events will be set.
	 * Otherwise, the public facet of Nelio Session Recordings will be disabled.
	 *
	 * **Notice.** Our plugin uses JavaScript to track events. Be careful when limiting functions
	 * in PHP, as it’s possible that your cache or CDN ends up caching these limitations and, as a result,
	 * none of your visitors are tested.
	 *
	 * @param boolean $disabled whether the current request should be excluded from session recording or not. Default: `false`.
	 *
	 * @since 1.0.0
	 */
	return apply_filters( 'neliosr_disable_session_recording', false );

}//end neliosr_is_session_recording_disabled()

/**
 * Returns whether this site is a staging site (based on its URL) or not.
 *
 * @return boolean Whether this site is a staging site or not.
 *
 * @since 1.0.0
 */
function neliosr_is_staging() {

	/**
	 * List of URLs (or keywords) used to identify a staging site.
	 *
	 * If `neliosr_home_url` matches one of the given values, the current site will
	 * be considered as a staging site.
	 *
	 * @param array $urls list of staging URLs (or fragments). Default: `[ 'staging' ]`.
	 *
	 * @since 1.0.0
	 */
	$staging_urls = apply_filters( 'neliosr_staging_urls', array( 'staging' ) );
	foreach ( $staging_urls as $staging_url ) {
		if ( strpos( neliosr_home_url(), $staging_url ) !== false ) {
			return true;
		}//end if
	}//end foreach

	return false;

}//end neliosr_is_staging()

/**
 * This function returns the timezone/UTC offset used in WordPress.
 *
 * @return string the meta ID, false otherwise.
 *
 * @since 1.0.0
 */
function neliosr_get_timezone() {

	$timezone_string = get_option( 'timezone_string', '' );
	if ( ! empty( $timezone_string ) ) {

		if ( 'UTC' === $timezone_string ) {
			return '+00:00';
		} else {
			return $timezone_string;
		}//end if
	}//end if

	$utc_offset = get_option( 'gmt_offset', 0 );

	if ( $utc_offset < 0 ) {
		$utc_offset_no_dec = '' . absint( $utc_offset );
		$result            = sprintf( '-%02d', absint( $utc_offset_no_dec ) );
	} else {
		$utc_offset_no_dec = '' . absint( $utc_offset );
		$result            = sprintf( '+%02d', absint( $utc_offset_no_dec ) );
	}//end if

	if ( $utc_offset === $utc_offset_no_dec ) {
		$result .= ':00';
	} else {
		$result .= ':30';
	}//end if

	return $result;

}//end neliosr_get_timezone()

/**
 * Returns the script version if available. If it isn't, it defaults to the plugin's version.
 *
 * @param string $file_name the JS name of a script in $plugin_path/assets/dist/js/. Don't include the extension or the path.
 *
 * @return string the version of the given script or the plugin's version if the former wasn't be found.
 *
 * @since 1.0.0
 */
function neliosr_get_script_version( $file_name ) {
	if ( ! file_exists( neliosr_instance()->plugin_path . "/assets/dist/js/$file_name.asset.php" ) ) {
		return neliosr_instance()->plugin_version;
	}//end if
	$asset = include neliosr_instance()->plugin_path . "/assets/dist/js/$file_name.asset.php";
	return $asset['version'];
}//end neliosr_get_script_version()

/**
 * Registers a script loading the dependencies automatically.
 *
 * @param string     $handle    the script handle name.
 * @param string     $file_name the JS name of a script in $plugin_path/assets/dist/js/. Don't include the extension or the path.
 * @param array|bool $args      (optional) An array of additional script loading strategies.
 *                              Otherwise, it may be a boolean in which case it determines whether the script is printed in the footer. Default: `false`.
 *
 * @since 1.0.0
 */
function neliosr_register_script_with_auto_deps( $handle, $file_name, $args = false ) {

	$asset = array(
		'dependencies' => array(),
		'version'      => neliosr_instance()->plugin_version,
	);

	$path = neliosr_instance()->plugin_path . "/assets/dist/js/$file_name.asset.php";
	if ( file_exists( $path ) ) {
		// phpcs:ignore
		$asset = include $path;
	}//end if

	// NOTE. Add regenerator-runtime to our components package to make sure AsyncPaginate works.
	if ( is_wp_version_compatible( '5.8' ) && 'neliosr-components' === $handle ) {
		$asset['dependencies'] = array_merge( $asset['dependencies'], array( 'regenerator-runtime' ) );
	}//end if

	/**
	 * Filters the dependencies of a script.
	 *
	 * @param array $dependencies Array of dependencies.
	 * @param string $handle Script handle.
	 *
	 * @since 1.2.0
	 */
	$asset['dependencies'] = apply_filters( 'neliosr_script_dependencies', $asset['dependencies'], $handle );

	if ( is_wp_version_compatible( '6.3' ) ) {
		wp_register_script(
			$handle,
			neliosr_instance()->plugin_url . "/assets/dist/js/$file_name.js",
			$asset['dependencies'],
			$asset['version'],
			$args
		);
	} else {
		wp_register_script(
			$handle,
			neliosr_instance()->plugin_url . "/assets/dist/js/$file_name.js",
			$asset['dependencies'],
			$asset['version'],
			is_array( $args ) ? neliosr_array_get( $args, 'in_footer', false ) : $args
		);
	}//end if

	if ( in_array( 'wp-i18n', $asset['dependencies'], true ) ) {
		wp_set_script_translations( $handle, 'nelio-session-recordings' );
	}//end if

}//end neliosr_register_script_with_auto_deps()

/**
 * Enqueues a script loading the dependencies automatically.
 *
 * @param string     $handle    the script handle name.
 * @param string     $file_name the JS name of a script in $plugin_path/assets/dist/js/. Don't include the extension or the path.
 * @param array|bool $args      (optional) An array of additional script loading strategies.
 *                              Otherwise, it may be a boolean in which case it determines whether the script is printed in the footer. Default: `false`.
 *
 * @since 1.0.0
 */
function neliosr_enqueue_script_with_auto_deps( $handle, $file_name, $args = false ) {

	neliosr_register_script_with_auto_deps( $handle, $file_name, $args );
	wp_enqueue_script( $handle );

}//end neliosr_enqueue_script_with_auto_deps()

/**
 * This function returns the two-letter locale used in WordPress.
 *
 * @return string the two-letter locale used in WordPress.
 *
 * @since 1.0.0
 */
function neliosr_get_language() {

	// Language of the blog.
	$lang = get_option( 'WPLANG' );
	$lang = ! empty( $lang ) ? $lang : 'en_US';

	// Convert into a two-char string.
	if ( strpos( $lang, '_' ) > 0 ) {
		$lang = substr( $lang, 0, strpos( $lang, '_' ) );
	}//end if

	return $lang;

}//end neliosr_get_language()

/**
 * Returns the home URL.
 *
 * @param string $path Optional. Path relative to the home URL.
 *
 * @return string Returns the home URL.
 *
 * @since 1.0.0
 */
function neliosr_home_url( $path = '' ) {

	$path = preg_replace( '/^\/*/', '', $path );
	if ( ! empty( $path ) ) {
		$path = '/' . $path;
	}//end if

	/**
	 * Filters the home URL.
	 *
	 * @param string $url  Home URL using the given path.
	 * @param string $path Path relative to the home URL.
	 *
	 * @since 5.0.16
	 */
	return apply_filters( 'neliosr_home_url', home_url( $path ), $path );

}//end neliosr_home_url()

/**
 * Gets script extra attributes.
 *
 * @return array List of attribute pairs (key,value) to insert in a script tag.
 *
 * @since 1.0.0
 */
function neliosr_get_extra_script_attributes() {
	/**
	 * Filters the attributes that should be added to a <script> tag.
	 *
	 * @param array $attributes an array where keys and values are the attribute names and values.
	 *
	 * @since 1.0.0
	 */
	$attributes = apply_filters( 'neliosr_add_extra_script_attributes', array() );
	return implode(
		' ',
		array_map(
			function( $key, $value ) {
				return sprintf( '%s="%s"', $key, esc_attr( $value ) );
			},
			array_keys( $attributes ),
			array_values( $attributes )
		)
	);
}//end neliosr_get_extra_script_attributes()

/**
 * Generates a unique ID.
 *
 * @return string unique ID.
 *
 * @since 1.0.0
 */
function neliosr_uuid() {

	$data    = random_bytes( 16 );
	$data[6] = chr( ord( $data[6] ) & 0x0f | 0x40 );
	$data[8] = chr( ord( $data[8] ) & 0x3f | 0x80 );

	return vsprintf( '%s%s-%s-%s-%s-%s%s%s', str_split( bin2hex( $data ), 4 ) );

}//end neliosr_uuid()

/**
 * Logs something on the screen if request contains “neliosrlog”.
 *
 * @param any     $log what to log.
 * @param boolean $pre whether to wrap log in `<pre>` or not (i.e. HTML comment). Default: `false`.
 *
 * @since 1.0.0
 */
function neliosr_log( $log, $pre = false ) {
	// phpcs:disable
	if ( ! isset( $_GET['neliosrlog'] ) ) {
		return;
	}//end if
	echo $pre ? '<pre>' : "\n<!-- [NELIOSRLOG]\n";
	print_r( $log );
	echo $pre ? '</pre>' : "\n-->\n";
	// phpcs:enable
}//end neliosr_log()

/**
 * Returns a function whose return value is the given constant.
 *
 * @param any $value the constant the generated function will return.
 *
 * @return function a function whose return value is the given constant.
 *
 * @since 1.0.0
 */
function neliosr_return_constant( $value ) {
	return function() use ( &$value ) {
		return $value;
	};
}//end neliosr_return_constant()

/**
 * Creates a permission callback function that check if the current user has the provided capability.
 *
 * @param string $capability expected capability.
 *
 * @return function permission callback function to use in REST API.
 *
 * @since 1.0.0
 */
function neliosr_capability_checker( $capability ) {
	return function() use ( $capability ) {
		return current_user_can( $capability );
	};
}//end neliosr_capability_checker()

/**
 * Returns the post ID of a given URL.
 *
 * @param string $url a URL.
 *
 * @return int post ID or 0 on failure
 *
 * @since 1.2.0
 */
function neliosr_url_to_postid( $url ) {
	if ( function_exists( 'wpcom_vip_url_to_postid' ) ) {
		return wpcom_vip_url_to_postid( $url );
	}//end if

	// phpcs:ignore
	return url_to_postid( $url );
}//end neliosr_url_to_postid()
