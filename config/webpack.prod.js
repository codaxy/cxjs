var webpack = require('webpack'),
   ExtractTextPlugin = require("extract-text-webpack-plugin"),
   CopyWebpackPlugin = require('copy-webpack-plugin'),
   merge = require('webpack-merge'),
   common = require('./webpack.config'),
path = require('path')

var sass = new ExtractTextPlugin({
   filename: "app.css",
   allChunks: true
});

var specific = {
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
      new webpack.optimize.UglifyJsPlugin(),
      new webpack.DefinePlugin({
         'process.env.NODE_ENV': JSON.stringify('production')
      }),
      sass,
      new CopyWebpackPlugin([{
         from: path.join(__dirname, '../assets'),
         to: path.join(__dirname, '../dist/assets'),
      }])
   ],

   output: {
      publicPath: '/'
   }
};

module.exports = merge(common, specific);
