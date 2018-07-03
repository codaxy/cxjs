var webpack = require('webpack'),
   CopyWebpackPlugin = require('copy-webpack-plugin'),
   InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin'),
   WebpackCleanupPlugin  = require('webpack-cleanup-plugin'),
   merge = require('webpack-merge'),
   common = require('./webpack.config'),
   path = require('path');

let root = process.env.npm_lifecycle_event.indexOf(':root') != -1;

var specific = {
   mode: 'production',

   optimization: {
      runtimeChunk: {
         name: "manifest",
      },
   },

   plugins: [
      new webpack.DefinePlugin({
         'process.env.NODE_ENV': JSON.stringify('production')
      }),
      //new WebpackCleanupPlugin(),
      new CopyWebpackPlugin([{
         from: path.join(__dirname, '../assets'),
         to: path.join(__dirname, '../dist/assets'),
      }, {
         from: path.resolve(__dirname, '../../misc/netlify.redirects'),
         to: '_redirects',
         toType: 'file'
      }, {
         from: path.resolve(__dirname, '../../misc/netlify.headers'),
         to: '_headers',
         toType: 'file'
      }]),
      new InlineManifestWebpackPlugin('manifest'),
   ],

   output: {
      path: path.join(__dirname, '../dist'),
      filename: "[name].ltc.[chunkhash].js",
      hashDigestLength: 5,
      publicPath: root ? "/" : "/gallery/"
   }
};

module.exports = merge(common(true), specific);
