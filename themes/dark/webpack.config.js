const webpack = require('webpack'),
   ExtractTextPlugin = require("extract-text-webpack-plugin"),
   HtmlWebpackPlugin = require('html-webpack-plugin'),
   merge = require('webpack-merge'),
   combine = require('webpack-combine-loaders'),
   path = require('path'),
   babelConfig = require('../shared/babel.config');

var common = {

   resolve: {
      alias: {
         cx: path.resolve(path.join(__dirname, '../../packages/cx-core/src')),
         'cx-react': path.resolve(path.join(__dirname, '../../packages/cx-react')),
         'cx-theme-dark': path.resolve(path.join(__dirname, '../../packages/cx-theme-dark')),
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
         include: /(themes|cx-core|cx-react)/,
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
      new HtmlWebpackPlugin({
         template: path.join(__dirname, 'index.html'),
         hash: true
      })
   ]
};

var specific;

switch (process.env.npm_lifecycle_event) {
   case 'build:theme:dark':
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
            path: path.join(__dirname, '../dist/dark/'),
            publicPath: "./"
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
            hot: true,
            port: 8091,
            noInfo: false,
            inline: true,
            historyApiFallback: true
         }
      };
      break;
}

module.exports = merge(common, specific);
