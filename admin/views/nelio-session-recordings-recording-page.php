<?php
/**
 * Displays the UI for a session recording.
 *
 * @since 1.0.0
 */

defined( 'ABSPATH' ) || exit;

?>

<div class="recording">

	<div id="recording" class="hide-if-no-js"></div>

	<div class="wrap hide-if-js recording-no-js">
		<h1 class="wp-heading-inline"><?php echo esc_html( $title ); ?></h1>
		<div class="notice notice-error notice-alt">
			<p>
			<?php
				echo esc_html_x( 'The recording viewer requires JavaScript. Please enable JavaScript in your browser settings.', 'user', 'nelio-session-recordings' );
			?>
			</p>
		</div><!-- .notice -->
	</div><!-- .recording-no-js -->

</div><!-- .recording-viewer -->
