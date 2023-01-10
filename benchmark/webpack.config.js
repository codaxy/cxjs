const webpack = require('webpack'),
   HtmlWebpackPlugin = require('html-webpack-plugin'),
   MiniCssExtractPlugin = require("mini-css-extract-plugin"),
   CxScssManifestPlugin = require('../packages/cx-scss-manifest-webpack-plugin/src/index'),
   BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin,
   path = require('path'),
   babelConfig = require('./babel-config');

let dev = process.env.npm_lifecycle_event.startsWith("dev");

let config = {
   mode: dev ? 'development' : 'production',
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
         include: /[\\\/](misc|benchmark|cx|cx-react)[\\\/]/,
         loader: 'babel-loader',
         options: babelConfig(true)
      }, {
         test: /\.scss$/,
         use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      }, {
         test: /\.css$/,
         use: [MiniCssExtractPlugin.loader, 'css-loader'],
      }]
   },
   entry: {
      // vendor: [
      //    'babel-polyfill',
      //    'cx-react'
      // ],
      app: path.join(__dirname, 'index.js'),
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
         'process.env.NODE_ENV': JSON.stringify(dev ? 'development' : 'production'),
      }),
      new MiniCssExtractPlugin({
         filename: 'app.ltc.[chunkhash].css',
         chunkFilename: '[id].ltc.[chunkhash].css',
      }),
      new HtmlWebpackPlugin({
         template: path.join(__dirname, 'index.html')
      }),
      //dev && new webpack.HotModuleReplacementPlugin(),
   ],

   devServer: {
      hot: true,
      port: 8111,
      noInfo: false,
      inline: true,
      historyApiFallback: true,
   },
};

module.exports = config;
