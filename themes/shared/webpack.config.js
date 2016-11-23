const webpack = require('webpack'),
   ExtractTextPlugin = require("extract-text-webpack-plugin"),
   HtmlWebpackPlugin = require('html-webpack-plugin'),
   merge = require('webpack-merge'),
   combine = require('webpack-combine-loaders'),
   path = require('path'),
   babelConfig = require('../shared/babel.config');

module.exports = function(name, themePath, port) {

   var common = {

      resolve: {
         alias: {
            cx: path.resolve(path.join(themePath, '../../packages/cx-core/src')),
            'cx-react': path.resolve(path.join(themePath, '../../packages/cx-react')),
            'cx-theme-dark': path.resolve(path.join(themePath, '../../packages/cx-theme-dark')),
            theme: themePath,
            shared: path.join(themePath, '../shared')
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
      output: {
         path: themePath,
         filename: "[name].js"
      },
      externals: {
         "react": "React",
         "react-dom": "ReactDOM"
      },
      plugins: [
         new HtmlWebpackPlugin({
            template: path.join(themePath, 'index.html'),
            hash: true
         })
      ]
   };

   var specific;

   if (process.env.npm_lifecycle_event == `build:theme:${name}`) {
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

         entry: {
            app: themePath + '/index.js',
         },

         output: {
            path: path.join(themePath, `../dist/${name}/`),
            publicPath: "./"
         }
      };
   }
   else {
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
         entry: {
            app: [
               'react-dev-utils/webpackHotDevClient',
               themePath + '/index.js'
            ]
         },
         output: {
            publicPath: '/'
         },
         devtool: 'eval',
         devServer: {
            hot: true,
            port: port,
            noInfo: false,
            inline: true,
            historyApiFallback: true
         }
      }
   }

   return merge(common, specific);
};
