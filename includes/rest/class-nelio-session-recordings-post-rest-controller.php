<?php
/**
 * This file contains the class that defines REST API endpoints for posts.
 *
 * @since 1.2.0
 */

defined( 'ABSPATH' ) || exit;

class Nelio_Session_Recordings_Post_REST_Controller extends WP_REST_Controller {

	/**
	 * The single instance of this class.
	 *
	 * @var    Nelio_Session_Recordings_REST_API
	 */
	protected static $instance;

	/**
	 * Returns the single instance of this class.
	 *
	 * @return Nelio_Session_Recordings_Post_REST_Controller the single instance of this class.
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
			'/post',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_post' ),
					'permission_callback' => neliosr_capability_checker( 'edit_neliosr_recordings' ),
					'args'                => $this->get_item_params(),
				),
			)
		);

		register_rest_route(
			neliosr_instance()->rest_namespace,
			'/post/search',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'search_posts' ),
					'permission_callback' => neliosr_capability_checker( 'edit_neliosr_recordings' ),
					'args'                => $this->get_collection_params(),
				),
			)
		);

		register_rest_route(
			neliosr_instance()->rest_namespace,
			'/types',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_types' ),
					'permission_callback' => neliosr_capability_checker( 'edit_neliosr_recordings' ),
					'args'                => array(),
				),
			)
		);

		register_rest_route(
			neliosr_instance()->rest_namespace,
			'/post/(?P<src>[\d]+)/overwrites/(?P<dest>[\d]+)',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'overwrite_post_content' ),
					'permission_callback' => neliosr_capability_checker( 'edit_neliosr_recordings' ),
					'args'                => array(),
				),
			)
		);

	}//end register_routes()

	/**
	 * Search posts
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_REST_Response The response
	 */
	public function search_posts( $request ) {

		$query     = $request['query'];
		$post_type = $request['type'];
		$per_page  = $request['per_page'];
		$page      = $request['page'];

		if ( 'nab_experiment' === $post_type ) {
			return new WP_Error(
				'not-found',
				_x( 'Tests are not exposed through this endpoint.', 'text', 'nelio-session-recordings' )
			);
		}//end if

		$data = $this->search_wp_posts( $query, $post_type, $per_page, $page );
		return new WP_REST_Response( $data, 200 );

	}//end search_posts()

	/**
	 * Get post
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_REST_Response The response
	 */
	public function get_post( $request ) {

		$post_id   = $request['id'];
		$post_type = $request['type'];

		if ( 'nab_experiment' === $post_type ) {
			return new WP_Error(
				'not-found',
				_x( 'Tests are not exposed through this endpoint.', 'text', 'nelio-session-recordings' )
			);
		}//end if

		$post = get_post( $post_id );
		if ( ! $post || $post_type !== $post->post_type || is_wp_error( $post ) ) {
			return new WP_Error(
				'not-found',
				sprintf(
					/* translators: Post ID */
					_x( 'Content with ID “%d” not found.', 'text', 'nelio-session-recordings' ),
					$post_id
				)
			);
		}//end if

		$data = $this->build_post_json( $post );
		return new WP_REST_Response( $data, 200 );

	}//end get_post()

	public function get_types() {

		include_once ABSPATH . 'wp-admin/includes/plugin.php';

		$post_types = get_post_types(
			array(
				'public' => true,
			),
			'objects'
		);

		$data = array_map(
			function( $post_type ) {
				return array(
					'name'   => $post_type->name,
					'label'  => $post_type->label,
					'labels' => array(
						'singular_name' => $post_type->labels->singular_name,
					),
					'kind'   => 'entity',
				);
			},
			$post_types
		);

		if ( isset( $data['product'] ) ) {
			$data['product_variation'] = array(
				'name'   => 'product_variation',
				'label'  => _x( 'Product Variation', 'text', 'nelio-session-recordings' ),
				'labels' => array(
					'singular_name' => _x( 'Product Variation', 'text', 'nelio-session-recordings' ),
				),
				'kind'   => 'entity',
			);
		}//end if

		return new WP_REST_Response( $data, 200 );

	}//end get_types()

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
			'type'     => array(
				'description'       => 'Limit results to those matching a post type.',
				'type'              => 'string',
				'default'           => 'post',
				'sanitize_callback' => 'sanitize_text_field',
			),
			'query'    => array(
				'required'          => true,
				'description'       => 'Limit results to those matching a string.',
				'type'              => 'string',
				'sanitize_callback' => 'sanitize_text_field',
			),
		);
	}//end get_collection_params()

	/**
	 * Get the query params for a single item.
	 *
	 * @return array
	 */
	public function get_item_params() {
		return array(
			'id'   => array(
				'required'          => true,
				'description'       => 'Post ID.',
				'type'              => 'number',
				'sanitize_callback' => 'absint',
			),
			'type' => array(
				'description'       => 'Limit results to those matching a post type.',
				'type'              => 'string',
				'default'           => 'post',
				'sanitize_callback' => 'sanitize_text_field',
			),
		);
	}//end get_item_params()

	public function search_wp_posts( $query, $post_type, $per_page, $page ) {

		$posts = array();
		if ( 1 === $page ) {
			$posts = $this->search_wp_post_by_id_or_url( $query, $post_type );
		}//end if

		$args = array(
			'post_title__like' => $query,
			'post_type'        => $post_type,
			'order'            => 'desc',
			'orderby'          => 'date',
			'posts_per_page'   => $per_page,
			'post_status'      => array( 'publish', 'draft' ),
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

			global $post;
			array_push(
				$posts,
				$this->build_post_json( $post )
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

	}//end search_wp_posts()

	private function search_wp_post_by_id_or_url( $id_or_url, $post_type ) {

		if ( ! absint( $id_or_url ) && ! filter_var( $id_or_url, FILTER_VALIDATE_URL ) ) {
			return array();
		}//end if

		$post_id = $id_or_url;
		if ( ! absint( $id_or_url ) ) {
			$post_id = neliosr_url_to_postid( $id_or_url );
		}//end if

		$post = get_post( $post_id );
		if ( ! $post || is_wp_error( $post ) ) {
			return array();
		}//end if

		if ( $post_type !== $post->post_type ) {
			return array();
		}//end if

		if ( ! in_array( $post->post_status, array( 'publish', 'draft' ), true ) ) {
			return array();
		}//end if

		return array( $this->build_post_json( $post ) );

	}//end search_wp_post_by_id_or_url()

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

	private function get_the_author( $post ) {

		return get_the_author_meta( 'display_name', $post->post_author );

	}//end get_the_author()

	private function get_post_time( $post, $default ) {
		$date = ' ' . $post->post_date_gmt;
		return strpos( $date, '0000-00-00' )
			? $default
			: get_post_time( 'c', true, $post );
	}//end get_post_time()

	private function get_post_type_name( $post ) {

		$post_type_name = _x( 'Post', 'text (default post type name)', 'nelio-session-recordings' );
		$post_type      = get_post_type_object( $post->post_type );
		if ( ! empty( $post_type ) && isset( $post_type->labels ) && isset( $post_type->labels->singular_name ) ) {
			$post_type_name = $post_type->labels->singular_name;
		}//end if

		return $post_type_name;

	}//end get_post_type_name()

	private function build_post_json( $post ) {

		$post_title   = trim( $post->post_title );
		$post_excerpt = trim( $post->post_excerpt );
		$permalink    = get_permalink( $post );
		$type_label   = $this->get_post_type_name( $post );

		$author      = absint( $post->post_author );
		$author_name = $this->get_the_author( $post );

		$date = $this->get_post_time( $post, false );

		$image_id      = absint( get_post_meta( $post->ID, '_thumbnail_id', true ) );
		$image_src     = '';
		$thumbnail_src = '';
		if ( $image_id ) {
			$image     = wp_get_attachment_image_src( $image_id );
			$thumbnail = wp_get_attachment_image_src( $image_id, 'thumbnail' );
			if ( empty( $image ) ) {
				$image_id = 0;
			} else {
				$image_src = $image[0];
			}//end if
			if ( ! empty( $thumbnail ) ) {
				$thumbnail_src = $thumbnail[0];
			}//end if
		}//end if

		$extra_info = array();
		if ( absint( get_option( 'page_on_front' ) ) === $post->ID ) {
			$extra_info['specialPostType'] = 'page-on-front';
		} elseif ( absint( get_option( 'page_for_posts' ) ) === $post->ID ) {
			$extra_info['specialPostType'] = 'page-for-posts';
		}//end if

		/**
		 * Adds extra data to a post that’s about to be included in a Nelio A/B Testing’s post-related REST request.
		 *
		 * @param array   $options extra options.
		 * @param WP_Post $post    the post.
		 *
		 * @since 5.0.0
		 */
		$extra_info = apply_filters( 'nab_post_json_extra_data', $extra_info, $post );

		return array(
			'author'       => $author,
			'authorName'   => $author_name,
			'date'         => $date,
			'id'           => $post->ID,
			'title'        => $post_title,
			'excerpt'      => $post_excerpt,
			'imageId'      => $image_id,
			'imageSrc'     => $image_src,
			'thumbnailSrc' => $thumbnail_src,
			'type'         => $post->post_type,
			'typeLabel'    => $type_label,
			'link'         => $permalink,
			'extra'        => $extra_info,
		);

	}//end build_post_json()

}//end class
