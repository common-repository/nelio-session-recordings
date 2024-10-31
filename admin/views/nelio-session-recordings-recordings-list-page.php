<?php
/**
 * Displays the UI for a list of session recordings.
 *
 * @since 1.0.0
 */

defined( 'ABSPATH' ) || exit;

?>

<div class="recordings-list">

	<div id="recordings-list" class="hide-if-no-js"></div>

	<div class="wrap hide-if-js recordings-list-no-js">
		<h1 class="wp-heading-inline"><?php echo esc_html( $title ); ?></h1>
		<div class="notice notice-error notice-alt">
			<p>
			<?php
				echo esc_html_x( 'The recordings list requires JavaScript. Please enable JavaScript in your browser settings.', 'user', 'nelio-session-recordings' );
			?>
			</p>
		</div><!-- .notice -->
	</div><!-- .recordings-list-no-js -->

</div><!-- .recordings-list -->
