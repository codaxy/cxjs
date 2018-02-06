const webpack = require('webpack'),
   ExtractTextPlugin = require("extract-text-webpack-plugin"),
   HtmlWebpackPlugin = require('html-webpack-plugin'),
   CxScssManifestPlugin = require('../packages/cx-scss-manifest-webpack-plugin/src/index'),
   BabiliPlugin = require("babili-webpack-plugin"),
   BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin,
   merge = require('webpack-merge'),
   path = require('path'),
   babelConfig = require('./babel.config');

let production = process.env.npm_lifecycle_event && process.env.npm_lifecycle_event.indexOf('build') == 0;

let common = {

   resolve: {
      alias: {
         'cx': path.resolve(path.join(__dirname, '../packages/cx')),
         //'cx-react': path.resolve(path.join(__dirname, '../packages/cx-react')),
         //'cx-react': path.resolve(path.join(__dirname, '../packages/cx-preact')),
         //'cx-react': path.resolve(path.join(__dirname, '../packages/cx-inferno')),
         litmus: __dirname
      },
      extensions: [".js", ".ts", ".tsx", ".json"]
   },

   module: {
      loaders: [{
         test: /\.json$/,
         loader: 'json-loader'
      }, {
         test: /\.js$/,
         include: /(litmus|cx)/,
         loader: 'babel-loader',
         query: babelConfig(production)
      }, {
         test: /\.tsx?$/,
         include: /litmus/,
         loaders: [
            {
               loader: 'babel-loader',
               query: babelConfig(production)
            },
            'ts-loader',
         ]
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
      path: __dirname,
      filename: "[name].js"
   },
   // externals: {
   //    "react": "React",
   //    "react-dom": "ReactDOM"
   // },
   plugins: [
      //new webpack.optimize.CommonsChunkPlugin("vendor"),
      new HtmlWebpackPlugin({
         template: path.join(__dirname, 'index.html')
      }),
      new CxScssManifestPlugin({
         outputPath: path.join(__dirname, 'manifest.scss')
      })
   ]
};

let specific;

if (production) {
   let sass = new ExtractTextPlugin({
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
         new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
         }),

         new webpack.optimize.UglifyJsPlugin({
            compress: true,
            mangle: false,
            beautify: true
         }),

         // new BabiliPlugin({ mangle: false }),

         //new webpack.optimize.ModuleConcatenationPlugin(),
         sass,
         new BundleAnalyzerPlugin()
      ],

      output: {
         path: path.join(__dirname, 'dist'),
         publicPath: '.'
      }
   };
}
else {
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
         new webpack.HotModuleReplacementPlugin(),
         new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
         })
      ],
      output: {
         publicPath: '/'
      },
      performance: {
         hints: false
      },
      devtool: 'eval',
      devServer: {
         contentBase: '/',
         hot: true,
         port: 8085,
         noInfo: false,
         inline: true,
         historyApiFallback: true,
         //quiet: true
      }
   };
}

module.exports = merge(common, specific);
