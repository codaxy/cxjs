const webpack = require('webpack'),
   ExtractTextPlugin = require("extract-text-webpack-plugin"),
   HtmlWebpackPlugin = require('html-webpack-plugin'),
   CxScssManifestPlugin = require('../packages/cx-scss-manifest-webpack-plugin/src/index'),
   BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin,
   path = require('path'),
   babelConfig = require('./babel.config');

let sass = new ExtractTextPlugin({
   filename: "app.css",
   allChunks: true
});

let config = {
   mode: 'production',
   resolve: {
      alias: {
         'cx': path.resolve(path.join(__dirname, '../packages/cx')),
         //'cx-react': path.resolve(path.join(__dirname, '../packages/cx-react')),
         //'cx-react': path.resolve(path.join(__dirname, '../packages/cx-preact')),
         //'cx-react': path.resolve(path.join(__dirname, '../packages/cx-inferno'))
      },
      extensions: [".js", ".ts", ".tsx", ".json"]
   },
   module: {
      rules: [{
         test: /\.json$/,
         loader: 'json-loader'
      }, {
         test: /\.js$/,
         include: /(benchmark|cx)/,
         loader: 'babel-loader',
         query: babelConfig(true)
      }, {
         test: /\.scss$/,
         loaders: sass.extract(['css-loader', 'sass-loader'])
      }, {
         test: /\.css$/,
         loaders: sass.extract(['css-loader'])
      }]
   },
   entry: {
      // vendor: [
      //    'babel-polyfill',
      //    'cx-react'
      // ],
      app: __dirname + '/index.js'
   },
   output: {
      filename: "[name].js",
      path: path.join(__dirname, 'dist'),
      publicPath: '.'
   },
   externals: {
      "react": "React",
      "react-dom": "ReactDOM"
   },
   plugins: [
      new webpack.DefinePlugin({
         'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      new HtmlWebpackPlugin({
         template: path.join(__dirname, 'index.html')
      }),
      sass,
   ]
};

module.exports = config;
