const webpack = require('webpack'),
   ExtractTextPlugin = require("extract-text-webpack-plugin"),
   HtmlWebpackPlugin = require('html-webpack-plugin'),
   CopyWebpackPlugin = require('copy-webpack-plugin'),
   merge = require('webpack-merge'),
   combine = require('webpack-combine-loaders'),
   path = require('path'),
   babelConfig = require('../shared/babel.config'),
   gtm = require('../../misc/tracking/gtm.config.js'),
   reactScripts = require('../../misc/reactScripts.js');

var common = {

   resolve: {
      alias: {
         cx: path.resolve(path.join(__dirname, '../../packages/cx')),
         'cx-react': path.resolve(path.join(__dirname, '../../packages/cx-react')),
         theme: __dirname,
         shared: path.join(__dirname, '../shared')
      }
   },

   module: {
      loaders: [{
         test: /\.json$/,
         loader: 'json-loader'
      }, {
         test: /\.js$/,
         include: /(themes|cx|cx-react)/,
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
      app: __dirname + '/index.js',
   },
   output: {
      path: __dirname,
      filename: "[name].[hash].js"
   },
   externals: {
      "react": "React",
      "react-dom": "ReactDOM"
   },
   plugins: [
      new HtmlWebpackPlugin({
         template: path.join(__dirname, 'index.html'),
         gtmb: gtm.body,
         gtmh: gtm.head,
         reactScripts: reactScripts
      })
   ]
};

var specific;

switch (process.env.npm_lifecycle_event) {
   case 'build:theme:home':
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
            new webpack.optimize.UglifyJsPlugin(),
            new webpack.DefinePlugin({
               'process.env.NODE_ENV': JSON.stringify('production')
            }),
            sass,
            new CopyWebpackPlugin([{
               from: path.join(__dirname, 'img'),
               to: path.join(__dirname, '../dist/img')
            }])
         ],

         output: {
            path: path.join(__dirname, '../dist/'),
            publicPath: "./"
         }
      };
      break;

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
            contentBase: __dirname,
            hot: true,
            port: 8099,
            noInfo: false,
            inline: true,
            historyApiFallback: true
         }
      };
      break;
}

module.exports = merge(common, specific);
