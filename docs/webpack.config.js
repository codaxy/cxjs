const webpack = require('webpack'),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'),
    CleanWebpackPlugin = require('clean-webpack-plugin'),
    merge = require('webpack-merge'),
    combine = require('webpack-combine-loaders'),
    path = require('path'),
    babelConfig = require('./babel.config');

var common = {

    resolve: {
        alias: {
            cx: path.resolve(path.join(__dirname, '../packages/cx-core/src')),
            'cx-react': path.resolve(path.join(__dirname, '../packages/cx-react')),
            //'cx-react': path.resolve(path.join(__dirname, '../packages/cx-inferno')),
            //'cx-react': path.resolve(path.join(__dirname, '../packages/cx-preact')),
            'cx-react-css-transition-group': path.resolve(path.join(__dirname, '../packages/cx-react-css-transition-group')),
            docs: __dirname
        }
    },

    module: {
        loaders: [{
            test: /\.json$/,
            loader: 'json-loader'
        }, {
            test: /\.js$/,
            include: /(docs|cx-core|cx-react)/,
            loaders: [{
                loader: 'babel-loader',
                query: babelConfig
            }, {
                loader: 'if-loader'
            }]
        }, {
            test: /\.(jpg|png)$/,
            loader: "file-loader"
        }]
    },
    entry: {
        vendor: ['cx-react', path.join(__dirname, 'polyfill')],
        app: __dirname + '/index.js',
    },
    output: {
        path: __dirname,
        filename: "[name].[hash].js"
    },
    // externals: {
    //    "react": "React",
    //    "react-dom": "ReactDOM"
    // },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            names: ["vendor", "manifest"],
            minChunks: Infinity
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'app',
            children: true,
            minChunks: Infinity
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'index.html'),
            minify: {
                removeComments: true
            }
        })
    ]
};

var specific;

switch (process.env.npm_lifecycle_event) {
    case 'build:docs':
        var sass = new ExtractTextPlugin({
            filename: "app.css",
            allChunks: true
        });
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
                new CleanWebpackPlugin(['dist']),
                new webpack.optimize.UglifyJsPlugin(),
                new webpack.DefinePlugin({
                    'process.env.NODE_ENV': JSON.stringify('production')
                }),
                sass,
                new OptimizeCssAssetsPlugin()
            ],

            output: {
                path: path.join(__dirname, 'dist'),
                filename: "[name].[chunkhash].js",
                hashDigestLength: 5,
                publicPath: "/docs/"
            }
        };
        break;

    // case 'measure:docs':
    //     var sass = new ExtractTextPlugin({
    //         filename: "app.css",
    //         allChunks: true
    //     });
    //     specific = {
    //
    //         module: {
    //             loaders: [{
    //                 test: /\.scss$/,
    //                 loaders: ["style", "css", "sass"]
    //             }, {
    //                 test: /\.css$/,
    //                 loader: ["style", "css"]
    //             }]
    //         },
    //
    //         "if-loader": 'production',
    //
    //         plugins: [
    //             new webpack.optimize.DedupePlugin(),
    //             new webpack.optimize.UglifyJsPlugin(),
    //             new webpack.DefinePlugin({
    //                 'process.env.NODE_ENV': JSON.stringify('production')
    //             }),
    //             sass,
    //             //new OptimizeCssAssetsPlugin()
    //         ],
    //         output: {
    //             publicPath: '/'
    //         },
    //         //devtool: 'eval',
    //         devServer: {
    //             contentBase: '/docs',
    //             hot: true,
    //             port: 8080,
    //             noInfo: false,
    //             inline: true,
    //             historyApiFallback: true
    //         }
    //     };
    //     break;

    default:
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
                new webpack.HotModuleReplacementPlugin()
            ],
            output: {
                publicPath: '/'
            },
            devtool: 'eval',
            devServer: {
                contentBase: '/docs',
                hot: true,
                port: 8065,
                noInfo: false,
                inline: true,
                historyApiFallback: true
            }
        };
        break;
}

module.exports = merge(common, specific);
