<?php

defined( 'ABSPATH' ) || exit;

echo esc_html_x( 'We use Nelio Session Recordings to record the actions that happen in visitor sessions in our website. Session recordings is a marketing technique with the aim of understanding what is better at converting visitors.', 'text', 'nelio-session-recordings' );

echo "\n\n";

echo esc_html_x( 'Nelio Session Recordings uses cookies to run session recordings and track the actions you take while visiting our website. These cookies do not store any personal information about you and can not be used to identify you in any way.', 'text', 'nelio-session-recordings' );

echo ' ';

printf(
	/* translators: 1 -> open tag, 2 -> close tag */
	esc_html_x( 'Whenever you perform an action that is relevant, such as visiting a certain page, clicking on an element, or submitting a form, this event is stored in Nelio’s cloud in compliance to %1$sNelio Session Recordings’ Terms and Conditions%2$s.', 'text', 'nelio-session-recordings' ),
	'<a href="https://neliosoftware.com/legal-information/nelio-session-recordings-terms-conditions/">',
	'</a>'
);

echo ' ';

echo esc_html_x( 'Please notice Nelio does not store any personal data that can be related to you, as all collected data is completely anonymous.', 'user', 'nelio-session-recordings' );
