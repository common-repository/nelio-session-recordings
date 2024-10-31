<?php
/**
 * This file has the Settings class, which defines and registers Nelio Session Recording's Settings.
 *
 * @since 1.0.0
 */

defined( 'ABSPATH' ) || exit;

/**
 * The Settings class, responsible of defining, registering, and providing access to all Nelio Session Recording's settings.
 *
 * @since 1.0.0
 */
final class Nelio_Session_Recordings_Settings {

	public array $gdpr_cookie = array(
		'customize' => false,
		'name'      => '',
		'value'     => '',
	);

	public bool $track_short_sessions = false;

	public array $sampling_rate = array(
		'mode' => 'unlimited',
	);

	public array $recordings_scope = array();

	/**
	 * The single instance of this class.
	 *
	 * @since  1.0.0
	 * @access protected
	 * @var    Nelio_Session_Recordings_Settings
	 */
	private static $instance;

	/**
	 * Initialize the class, set its properties, and add the proper hooks.
	 *
	 * @since  1.0.0
	 * @access protected
	 */
	protected function __construct() {
		$settings = get_option( 'nelio-session-recordings_settings', array() );
		$this->update( $settings );
	}//end __construct()

	/**
	 * Returns the single instance of this class.
	 *
	 * @return Nelio_Session_Recordings_Settings the single instance of this class.
	 *
	 * @since  1.0.0
	 * @access public
	 */
	public static function instance() {
		self::$instance = is_null( self::$instance ) ? new self() : self::$instance;
		return self::$instance;
	}//end instance()

	public function json(): array {
		return array(
			'gdprCookie'         => $this->gdpr_cookie,
			'trackShortSessions' => $this->track_short_sessions,
			'samplingRate'       => $this->sampling_rate,
			'recordingsScope'    => $this->recordings_scope,
		);
	}//end json()

	public function update( array $input ): void {
		$this->gdpr_cookie = neliosr_array_get( $input, 'gdprCookie', $this->gdpr_cookie );

		$this->track_short_sessions = ! empty( neliosr_array_get( $input, 'trackShortSessions', $this->track_short_sessions ) );

		$this->recordings_scope = neliosr_array_get( $input, 'recordingsScope', $this->recordings_scope );
		$this->recordings_scope = array_map( 'sanitize_text_field', $this->recordings_scope );
		$this->recordings_scope = array_values( array_filter( $this->recordings_scope ) );

		$sampling_rate = neliosr_array_get( $input, 'samplingRate', $this->sampling_rate );
		switch ( $sampling_rate['mode'] ) {
			case 'custom':
				$this->sampling_rate = array(
					'mode'       => 'custom',
					'percentage' => min( max( absint( $sampling_rate['percentage'] ), 0 ), 100 ),
				);
				break;

			case 'uniform':
				$this->sampling_rate = array(
					'mode'              => 'uniform',
					'estimatedSessions' => max( absint( $sampling_rate['estimatedSessions'] ), 0 ),
				);
				break;

			case 'unlimited':
			default:
				$this->sampling_rate = array( 'mode' => 'unlimited' );
				break;
		}//end switch

	}//end update()

	public function save(): void {
		update_option( 'nelio-session-recordings_settings', $this->json() );
	}//end save()

}//end class
