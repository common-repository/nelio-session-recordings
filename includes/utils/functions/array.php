<?php
/**
 * Nelio Session Recordings array helpers.
 *
 * @since 1.0.0
 */

defined( 'ABSPATH' ) || exit;

/**
 * Gets the value of a multidimensional array, safe checking the existance of all keys. If one key is not set or empty, it returns the default value.
 *
 * @param array        $array       Multidimensional array.
 * @param string|array $keys List of (nested) keys from the multidimensional array.
 * @param any          $default     Optional. Default value if keys are not found. Default: empty string.
 *
 * @return any the compositon of all its arguments (from left to right).
 *
 * @since 1.0.0
 */
function neliosr_array_get( $array, $keys, $default = '' ) {
	if ( ! is_array( $array ) ) {
		return $default;
	}//end if

	if ( ! is_array( $keys ) ) {
		$keys = array( $keys );
	}//end if

	$value = $array;
	foreach ( $keys as $key ) {
		if ( ! isset( $value[ $key ] ) ) {
			return $default;
		}//end if
		$value = $value[ $key ];
	}//end foreach

	return $value;
}//end neliosr_array_get()

/**
 * Checks if a predicate holds true for all the elements in an array.
 *
 * @param callable $predicate Boolean function that takes one item of the array at a time.
 * @param array    $array     Array of items.
 *
 * @return boolean whether the preciate holds true for all the elements in an array.
 *
 * @since 1.0.0
 */
function neliosr_every( $predicate, $array ) {
	foreach ( $array as $item ) {
		if ( ! call_user_func( $predicate, $item ) ) {
			return false;
		}//end if
	}//end foreach
	return true;
}//end neliosr_every()

/**
 * Checks if a predicate holds true for any element in an array.
 *
 * @param callable $predicate Boolean function that takes one item of the array at a time.
 * @param array    $array     Array of items.
 *
 * @return boolean whether the preciate holds true for any element in an array.
 *
 * @since 1.0.0
 */
function neliosr_some( $predicate, $array ) {
	foreach ( $array as $item ) {
		if ( call_user_func( $predicate, $item ) ) {
			return true;
		}//end if
	}//end foreach
	return false;
}//end neliosr_some()

/**
 * Checks if a predicate holds true for none of the elements in an array.
 *
 * @param callable $predicate Boolean function that takes one item of the array at a time.
 * @param array    $array     Array of items.
 *
 * @return boolean whether the preciate holds true for none of the elements in an array.
 *
 * @since 1.0.0
 */
function neliosr_none( $predicate, $array ) {
	return ! neliosr_some( $predicate, $array );
}//end neliosr_none()
