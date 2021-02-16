var webpack = require('webpack'),
   CopyWebpackPlugin = require('copy-webpack-plugin'),
   { CleanWebpackPlugin } = require('clean-webpack-plugin'),
   { merge } = require('webpack-merge'),
   common = require('./webpack.config'),
   path = require('path');

let root = process.env.npm_lifecycle_event.indexOf(':root') != -1;

var specific = {
   mode: 'production',

   plugins: [
      new webpack.DefinePlugin({
         'process.env.NODE_ENV': JSON.stringify('production')
      }),
      //new WebpackCleanupPlugin(),
      new CopyWebpackPlugin({
         patterns: [{
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
         }]
      }),

      new CleanWebpackPlugin()
   ],

   output: {
      path: path.join(__dirname, '../dist'),
      filename: "[name].ltc.[chunkhash].js",
      hashDigestLength: 5,
      publicPath: root ? "/" : "/gallery/"
   }
};

module.exports = merge(common(true), specific);
