const webpack = require('webpack'),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
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
                loader: 'babel',
                query: babelConfig
            }, {
                loader: 'if'
            }]
        }, {
            test: /\.(jpg|png)$/,
            loader: "file"
        }]
    },
    entry: {
        vendor: ['cx-react'],
        app: __dirname + '/index.js',
    },
    output: {
        path: __dirname,
        filename: "[name].js"
    },
    // externals: {
    //    "react": "React",
    //    "react-dom": "ReactDOM"
    // },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor",
            minChunks: Infinity
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'app',
            children: true,
            minChunks: 4
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'index.html'),
            hash: true
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
                    loaders: sass.extract(['css', 'sass'])
                }, {
                    test: /\.css$/,
                    loaders: sass.extract(['css'])
                }]
            },

            "if-loader": 'production',

            plugins: [
                new webpack.optimize.UglifyJsPlugin(),
                new webpack.DefinePlugin({
                    'process.env.NODE_ENV': JSON.stringify('production')
                }),
                sass
            ],

            output: {
                path: path.join(__dirname, 'dist'),
                publicPath: '/docs/'
            }
        };
        break;

    case 'measure:docs':
        var sass = new ExtractTextPlugin({
            filename: "app.css",
            allChunks: true
        });
        specific = {

            module: {
                loaders: [{
                    test: /\.scss$/,
                    loaders: ["style", "css", "sass"]
                }, {
                    test: /\.css$/,
                    loader: ["style", "css"]
                }]
            },

            "if-loader": 'production',

            plugins: [
                new webpack.optimize.UglifyJsPlugin(),
                new webpack.DefinePlugin({
                    'process.env.NODE_ENV': JSON.stringify('production')
                }),
                sass
            ],
            output: {
                publicPath: '/'
            },
            //devtool: 'eval',
            devServer: {
                contentBase: '/docs',
                hot: true,
                port: 8080,
                noInfo: false,
                inline: true,
                historyApiFallback: true
            }
        };
        break;

    default:
        specific = {
            module: {
                loaders: [{
                    test: /\.scss$/,
                    loaders: ["style", "css", "sass"]
                }, {
                    test: /\.css$/,
                    loader: ["style", "css"]
                }]
            },
            "if-loader": 'development',
            plugins: [
                new webpack.HotModuleReplacementPlugin()
            ],
            output: {
                publicPath: '/'
            },
            devtool: 'eval',
            devServer: {
                contentBase: '/docs',
                port: 8065,
                noInfo: false,
                inline: true,
                historyApiFallback: true
            }
        };
        break;
}

module.exports = merge(common, specific);
