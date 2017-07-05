const webpack = require('webpack'),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'),
    WebpackCleanupPlugin  = require('webpack-cleanup-plugin'),
    merge = require('webpack-merge'),
    combine = require('webpack-combine-loaders'),
    path = require('path'),
    ChunkManifestPlugin = require('chunk-manifest-webpack-plugin'),
    CopyWebpackPlugin = require('copy-webpack-plugin'),
    babelConfig = require('./babel.config'),
    gtm = require('../misc/tracking/gtm.js'),
    reactScripts = require('../misc/reactScripts');

var specific, production = process.env.npm_lifecycle_event.indexOf('build:docs') == 0;

if (production) {
    var sass = new ExtractTextPlugin({
        filename: "app.ltc.[chunkhash].css",
        allChunks: true
    });

    var root = process.env.npm_lifecycle_event.indexOf(':root') != -1;

    specific = {
        module: {
            loaders: [{
                test: /\.scss$/,
                loaders: sass.extract(['css-loader', 'sass-loader'])
            }, {
                test: /\.css$/,
                loaders: sass.extract(['css-loader'])
            }]
        },

        plugins: [
            new webpack.LoaderOptionsPlugin({
                options: {
                    "if-loader": 'production',
                }
            }),
            new WebpackCleanupPlugin(),
            new webpack.optimize.UglifyJsPlugin(),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify('production')
            }),
            sass,
            new OptimizeCssAssetsPlugin({
                cssProcessorOptions: {
                    safe: true,
                    mergeLonghand: false
                }
            }),
            new CopyWebpackPlugin([{
                from: path.resolve(__dirname, '../misc/netlify.redirects'),
                to: '_redirects',
                toType: 'file'
            }]),
        ],

        output: {
            path: path.join(__dirname, 'dist'),
            filename: "[name].ltc.[chunkhash].js",
            hashDigestLength: 5,
            publicPath: root ? "/" : "/docs/"
        }
    };
}
else {
    //dev
    specific = {
        module: {
            loaders: [{
                test: /\.scss$/,
                loaders: ["style-loader", "css-loader", "sass-loader"]
            }, {
                test: /\.css$/,
                loader: ["style-loader", "css-loader"]
            }]
        },
        entry: {
            app: [
                'react-dev-utils/webpackHotDevClient',
                __dirname + '/index.js'
            ]
        },
        plugins: [
            new webpack.LoaderOptionsPlugin({
                options: {
                    "if-loader": 'development',
                }
            }),
            new webpack.NamedModulesPlugin(),
            new webpack.HotModuleReplacementPlugin()
        ],
        output: {
            publicPath: '/'
        },
        devtool: 'eval',
        performance: {
            hints: false
        },
        devServer: {
            contentBase: '/docs',
            hot: true,
            port: 8065,
            noInfo: false,
            inline: true,
            historyApiFallback: true
        }
    };
}

var common = {

    resolve: {
        alias: {
            "cx/src": path.resolve(path.join(__dirname, '../packages/cx/src')),
            "cx/locale": path.resolve(path.join(__dirname, '../packages/cx/locale')),
            "cx": path.resolve(path.join(__dirname, '../packages/cx/src')),
            'cx-react': path.resolve(path.join(__dirname, '../packages/cx-react')),
            //'cx-react': path.resolve(path.join(__dirname, '../packages/cx-inferno')),
            //'cx-react': path.resolve(path.join(__dirname, '../packages/cx-preact')),
            'cx-react-css-transition-group': path.resolve(path.join(__dirname, '../packages/cx-react-css-transition-group')),
            docs: __dirname
        }
    },

    module: {
        loaders: [{
            test: /\.js$/,
            include: /(docs|cx|cx-react)/,
            loaders: [{
                loader: 'babel-loader',
                query: babelConfig({production: production})
            }, {
                loader: 'if-loader'
            }]
        }, {
            test: /\.json$/,
            loader: 'json-loader'
        }, {
            test: /\.(jpg|png)$/,
            loader: "file-loader"
        }]
    },
    entry: {
        vendor: [path.join(__dirname, 'polyfill')],
        app: __dirname + '/index.js',
    },
    output: {
        path: __dirname,
        filename: "[name].js"
    },
    externals: {
       "react": "React",
       "react-dom": "ReactDOM"
    },
    plugins: [
        // new webpack.optimize.CommonsChunkPlugin({
        //     names: ["vendor", "manifest"],
        //     minChunks: Infinity
        // }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'app',
            children: true,
            minChunks: Infinity
        }),
        new ChunkManifestPlugin({
            manifestVariable: "webpackManifest",
            inlineManifest: true
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'index.html'),
            gtmh: gtm.head,
            gtmb: gtm.body,
            reactScripts: reactScripts,
            favicon: path.join(__dirname, 'img/favicon.png'),
            minify: {
                removeComments: true
            }
        })
    ]
};

module.exports = merge(common, specific);
