var webpack = require('webpack'),
   CopyWebpackPlugin = require('copy-webpack-plugin'),
   ChunkManifestPlugin = require('chunk-manifest-webpack-plugin'),
   WebpackCleanupPlugin  = require('webpack-cleanup-plugin'),
   merge = require('webpack-merge'),
   common = require('./webpack.config'),
   path = require('path');

let root = process.env.npm_lifecycle_event.indexOf(':root') != -1;

var specific = {
   plugins: [
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
      publicPath: root ? "/" : "/gallery/"
   }
};

module.exports = merge(common(true), specific);
