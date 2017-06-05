var webpack = require('webpack'),
   ExtractTextPlugin = require("extract-text-webpack-plugin"),
   CopyWebpackPlugin = require('copy-webpack-plugin'),
   ChunkManifestPlugin = require('chunk-manifest-webpack-plugin'),
   WebpackMd5Hash = require('webpack-md5-hash'),
   WebpackCleanupPlugin  = require('webpack-cleanup-plugin'),
   merge = require('webpack-merge'),
   common = require('./webpack.config'),
   path = require('path');

// var sass = new ExtractTextPlugin({
//    filename: "app.css",
//    allChunks: true
// });

var specific = {
   // module: {
   //    loaders: [{
   //       test: /\.scss$/,
   //       loaders: sass.extract(['css-loader', 'sass-loader'])
   //    }, {
   //       test: /\.css$/,
   //       loaders: sass.extract(['css-loader'])
   //    }]
   // },

   plugins: [
      new WebpackMd5Hash(),
      new webpack.optimize.UglifyJsPlugin(),
      new webpack.DefinePlugin({
         'process.env.NODE_ENV': JSON.stringify('production')
      }),
      //sass,
      new WebpackCleanupPlugin(),
      new CopyWebpackPlugin([{
         from: path.join(__dirname, '../assets'),
         to: path.join(__dirname, '../dist/assets'),
      }]),
      new ChunkManifestPlugin({
         manifestVariable: "webpackManifest",
         inlineManifest: true
      }),
   ],

   output: {
      path: path.join(__dirname, '../dist'),
      filename: "[name].ltc.[chunkhash].js",
      hashDigestLength: 5,
      publicPath: "/gallery/"
   }
};

module.exports = merge(common, specific);
