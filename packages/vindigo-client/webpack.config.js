const VueLoaderPlugin = require('vue-loader/lib/plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const path = require('path');

const environment = process.env.NODE_ENV
const devtool = (environment === 'development') ? 'eval' : 'source-map';

// Export the full webpack config
module.exports = {
	context: path.join(__dirname, "."),
	entry: path.join(__dirname, "src/index.ts"),
	mode: environment,
	devtool: devtool,
	resolve: {
		alias: {
			'vue$': 'vue/dist/vue.runtime.esm.js'
		},
		extensions: [
			'.ts',
			'.vue',
			'.js'
		]
	},
	output: {
		clean: true,
		publicPath: '/',
		filename: '[name].[contenthash].js'
	},
	optimization: {
		minimize: true,
        minimizer: [
			new TerserPlugin({
				extractComments: false,
				terserOptions: {
					format: {
						comments: false,
					}
				}
			})
		],
		splitChunks: {
			chunks: 'all',
		  	cacheGroups: {
				vendor: {
					test: /node_modules/,
					chunks: 'initial',
					name: 'vendor',
					enforce: true
				}
		  	}
	  	}
	},
	performance: {
		hints: false,
		maxEntrypointSize: 512000,
		maxAssetSize: 512000
	},
	module: {
		rules: [

			// Load vue templates, scripts and styles
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			},

			// Load typescript files
			{
				test: /\.ts$/,
				loader: 'ts-loader',
				exclude: /node_modules/,
				options: {
					appendTsSuffixTo: [/\.vue$/],
					configFile: path.resolve(__dirname, "tsconfig.json"),
					transpileOnly: true
				}
			},

			// Load css files
			{
				test: /(\.css|\.postcss)/,
				use: [
					'vue-style-loader',
					'css-loader',
					'postcss-loader'
				]
			},

			// Copy over required files
			{
				test: /(\.png|\.svg|\.jpg)/,
				use: [
					{
						loader: 'file-loader',
						options: {
							esModule: false,
						}
					}
				]
			}
		]
	},
	plugins: [
		new VueLoaderPlugin(),
		new ForkTsCheckerWebpackPlugin(),
		new FriendlyErrorsWebpackPlugin(),
		new HtmlPlugin({
			template: path.join(__dirname, "public/index.html"),
			favicon: path.join(__dirname, "public/favicon.ico")
		})
	],
	devServer: {
		// Unfortunately hot reloading causes all kinds of stupid issues
		// such as beforeRouteEnter() not calling, as well as hot reloading
		// suddenly deciding to stop out of the blue.
		hot: false,
		port: 8080,
		compress: true,
		historyApiFallback: true,
		contentBase: path.join(__dirname, 'public'),
		overlay: {
			errors: true,
			warnings: false
		},
		proxy: {
			'/data': 'http://localhost:8085',
			'/upload': 'http://localhost:8085',
			'/graphql': 'http://localhost:8085',
			'/subscription': 'http://localhost:8085'
		}
	}
};
