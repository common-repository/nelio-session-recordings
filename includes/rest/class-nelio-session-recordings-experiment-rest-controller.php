<?php
/**
 * This file contains the class that defines REST API endpoints for
 * experiments.
 *
 * @since 1.2.0
 */

defined( 'ABSPATH' ) || exit;

class Nelio_Session_Recordings_Experiment_REST_Controller extends WP_REST_Controller {

	/**
	 * The single instance of this class.
	 *
	 * @since  5.0.0
	 * @var    Nelio_Session_Recordings_REST_API
	 */
	protected static $instance;

	/**
	 * Returns the single instance of this class.
	 *
	 * @return Nelio_Session_Recordings_Experiment_REST_Controller the single instance of this class.
	 *
	 * @since  5.0.0
	 */
	public static function instance() {

		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}//end if

		return self::$instance;

	}//end instance()

	/**
	 * Hooks into WordPress.
	 *
	 * @since  5.0.0
	 */
	public function init() {

		add_action( 'rest_api_init', array( $this, 'register_routes' ) );

	}//end init()

	/**
	 * Register the routes for the objects of the controller.
	 */
	public function register_routes() {

		register_rest_route(
			neliosr_instance()->rest_namespace,
			'/experiment/(?P<id>[\d]+)',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_experiment' ),
					'permission_callback' => neliosr_capability_checker( 'edit_neliosr_recordings' ),
					'args'                => array(),
				),
			)
		);

		register_rest_route(
			neliosr_instance()->rest_namespace,
			'/experiment/search',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'search_experiments' ),
					'permission_callback' => neliosr_capability_checker( 'edit_neliosr_recordings' ),
					'args'                => $this->get_collection_params(),
				),
			)
		);

	}//end register_routes()

	/**
	 * Retrieves an experiment
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_REST_Response The response
	 */
	public function get_experiment( $request ) {

		if ( ! class_exists( 'Nelio_AB_Testing_Experiment' ) || ! function_exists( 'nab_get_experiment' ) ) {
			return new WP_REST_Response( array(), 500 );
		}//end if

		$experiment_id = $request['id'];
		$experiment    = nab_get_experiment( $experiment_id );
		if ( is_wp_error( $experiment ) ) {
			return new WP_REST_Response( $experiment, 500 );
		}//end if

		return new WP_REST_Response( $this->json( $experiment ), 200 );

	}//end get_experiment()

	/**
	 * Search experiments
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_REST_Response The response
	 */
	public function search_experiments( $request ) {

		$query    = $request['query'];
		$per_page = $request['per_page'];
		$page     = $request['page'];

		$data = $this->search_experiment_posts( $query, $per_page, $page );
		return new WP_REST_Response( $data, 200 );

	}//end search_experiments()

	public function search_experiment_posts( $query, $per_page, $page ) {

		if ( ! class_exists( 'Nelio_AB_Testing_Experiment' ) || ! function_exists( 'nab_get_experiment' ) ) {
			return array();
		}//end if

		$posts = array();
		if ( 1 === $page ) {
			$posts = $this->search_wp_experiment_post_by_id( $query, 'nab_experiment' );
		}//end if

		$args = array(
			'post_title__like' => $query,
			'post_type'        => 'nab_experiment',
			'post_status'      => array( 'nab_running', 'nab_finished', 'nab_paused' ),
			'order'            => 'desc',
			'orderby'          => 'date',
			'posts_per_page'   => $per_page,
			'paged'            => $page,
		);

		add_filter( 'posts_where', array( $this, 'add_title_filter_to_wp_query' ), 10, 2 );
		$wp_query = new WP_Query( $args );
		remove_filter( 'posts_where', array( $this, 'add_title_filter_to_wp_query' ), 10, 2 );

		while ( $wp_query->have_posts() ) {

			$wp_query->the_post();

			// If the query was a number, we catched it when searching by ID or URL.
			if ( get_the_ID() === absint( $query ) ) {
				continue;
			}//end if

			$experiment_id = get_the_ID();
			$experiment    = nab_get_experiment( $experiment_id );
			if ( is_wp_error( $experiment ) ) {
				continue;
			}//end if

			array_push(
				$posts,
				$this->json( $experiment )
			);

		}//end while

		wp_reset_postdata();

		$data = array(
			'results'    => $posts,
			'pagination' => array(
				'more'  => $page < $wp_query->max_num_pages,
				'pages' => $wp_query->max_num_pages,
			),
		);

		return $data;

	}//end search_experiment_posts()

	/**
	 * A filter to search posts based on their title.
	 *
	 * This function modifies the posts query so that we can search posts based
	 * on a term that should appear in their titles.
	 *
	 * @param string   $where    The where clause, as it's originally defined.
	 * @param WP_Query $wp_query The $wp_query object that contains the params
	 *                           used to build the where clause.
	 *
	 * @return string a modified where statement that includes the post_title.
	 *
	 * @since 1.2.0
	 */
	public function add_title_filter_to_wp_query( $where, $wp_query ) {

		$term = $wp_query->get( 'post_title__like' );

		if ( ! empty( $term ) ) {
			global $wpdb;
			$term   = $wpdb->esc_like( $term );
			$term   = ' \'%' . $term . '%\'';
			$where .= ' AND ' . $wpdb->posts . '.post_title LIKE ' . $term;

		}//end if

		return $where;

	}//end add_title_filter_to_wp_query()

	private function search_wp_experiment_post_by_id( $id ) {

		if ( ! absint( $id ) ) {
			return array();
		}//end if

		$post_id = absint( $id );

		$post = get_post( $post_id );
		if ( ! $post || is_wp_error( $post ) ) {
			return array();
		}//end if

		if ( ! class_exists( 'Nelio_AB_Testing_Experiment' ) || ! function_exists( 'nab_get_experiment' ) ) {
			return array();
		}//end if

		$experiment = nab_get_experiment( $post_id );
		if ( is_wp_error( $experiment ) ) {
			return array();
		}//end if

		return array( $this->json( $experiment ) );

	}//end search_wp_experiment_post_by_id()

	/**
	 * Get the query params for collections
	 *
	 * @return array
	 */
	public function get_collection_params() {
		return array(
			'page'     => array(
				'description'       => 'Current page of the collection.',
				'type'              => 'integer',
				'default'           => 1,
				'sanitize_callback' => 'absint',
			),
			'per_page' => array(
				'description'       => 'Maximum number of items to be returned in result set.',
				'type'              => 'integer',
				'default'           => 50,
				'sanitize_callback' => 'absint',
			),
			'query'    => array(
				'required'          => true,
				'description'       => 'Limit results to those matching a string.',
				'type'              => 'string',
				'sanitize_callback' => 'sanitize_text_field',
			),
		);
	}//end get_collection_params()

	public function json( $experiment ) {

		$data = array(
			'id'           => $experiment->get_id(),
			'name'         => $experiment->get_name(),
			'description'  => $experiment->get_description(),
			'status'       => $experiment->get_status(),
			'type'         => $experiment->get_type(),
			'startDate'    => $experiment->get_start_date(),
			'endDate'      => $experiment->get_end_date(),
			'endMode'      => $experiment->get_end_mode(),
			'endValue'     => $experiment->get_end_value(),
			'alternatives' => $experiment->get_alternatives(),
			'goals'        => $experiment->get_goals(),
		);

		return $data;

	}//end json()

}//end class
