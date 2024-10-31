/**
 * External dependencies
 */
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const path = require( 'path' );
const { upperFirst } = require( 'lodash' );
const _ = require( 'lodash' );

const camelCase = ( s ) =>
	`A${ s }`.split( '-' ).map( upperFirst ).join( '' ).substring( 1 );
const kebabCase = ( s ) => s.replace( /([A-Z])/g, '-$1' ).toLowerCase();

/**
 * WordPress dependencies
 */
const DependencyExtractionWebpackPlugin = require( '@wordpress/dependency-extraction-webpack-plugin' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

/**
 * Internal dependencies
 */
const { dependencies } = require( './package' );

const NELIOSR_NAMESPACE = '@neliosr/';
const neliosrPackages = Object.keys( dependencies )
	.filter( ( packageName ) => packageName.startsWith( NELIOSR_NAMESPACE ) )
	.map( ( packageName ) => packageName.replace( NELIOSR_NAMESPACE, '' ) )
	.filter( ( packageName ) => 'types' !== packageName );

const __hackFilterOutSVGRulesNOTE = ( rules ) =>
	rules.filter(
		( { use } ) =>
			! ( use && use.includes && use.includes( '@svgr/webpack' ) )
	);

const config = {
	...defaultConfig,
	resolve: {
		alias: {
			'@safe-wordpress': path.resolve(
				__dirname,
				'packages/safe-wordpress'
			),
			'admin-stylesheets': path.resolve(
				'./assets/src/admin/stylesheets'
			),
		},
		extensions: _.uniq( [
			...( defaultConfig.resolve.extensions ?? [] ),
			'.js',
			'.jsx',
			'.ts',
			'.tsx',
		] ),
	},
	optimization: {
		...defaultConfig.optimization,
		splitChunks: {
			cacheGroups: _.omit(
				defaultConfig.optimization.splitChunks.cacheGroups,
				'style'
			),
		},
	},
	plugins: [
		...defaultConfig.plugins.filter(
			( p ) =>
				p.constructor.name !== 'CleanWebpackPlugin' &&
				p.constructor.name !== 'DependencyExtractionWebpackPlugin' &&
				p.constructor.name !== 'MiniCssExtractPlugin'
		),
		new DependencyExtractionWebpackPlugin( {
			requestToExternal: ( request ) =>
				request.startsWith( NELIOSR_NAMESPACE )
					? [
							'neliosr',
							camelCase(
								request.replace( NELIOSR_NAMESPACE, '' )
							),
					  ]
					: undefined,
			requestToHandle: ( request ) =>
				request.startsWith( NELIOSR_NAMESPACE )
					? 'neliosr-' + request.replace( NELIOSR_NAMESPACE, '' )
					: undefined,
			outputFormat: 'php',
		} ),
		new MiniCssExtractPlugin( {
			filename: ( { chunk } ) => `css/${ kebabCase( chunk.name ) }.css`,
		} ),
	],
	module: {
		...defaultConfig.module,
		rules: [
			...__hackFilterOutSVGRulesNOTE( defaultConfig.module.rules ),
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
			{
				test: /.svg$/,
				issuer: /\.tsx?$/,
				use: '@svgr/webpack',
			},
		],
	},
};

const pagePrefix = './assets/src/admin/pages';
const pages = {
	'plugin-list-page': `${ pagePrefix }/plugin-list`,
	'recordings-list-page': `${ pagePrefix }/recordings-list`,
	'recording-page': `${ pagePrefix }/recording`,
	'settings-page': `${ pagePrefix }/settings`,
	'welcome-page': `${ pagePrefix }/welcome`,
};

const scripts = {
	public: './assets/src/public',
};

module.exports = {
	...config,
	entry: {
		...neliosrPackages.reduce(
			( r, p ) => ( {
				...r,
				[ p ]: `./packages/${ p }/export.ts`,
			} ),
			{}
		),
		...pages,
		...scripts,
	},
	output: {
		path: path.resolve( __dirname, './assets/dist/' ),
		filename: 'js/[name].js',
		library: {
			name: 'neliosr',
			type: 'assign-properties',
		},
	},
};
