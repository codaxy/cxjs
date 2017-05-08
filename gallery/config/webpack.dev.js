var webpack = require('webpack'),
   merge = require('webpack-merge'),
   common = require('./webpack.config'),
   path = require("path");

var specific = {
   module: {
      loaders: [{
         test: /\.scss$/,
         use: [
            "style-loader",
            "css-loader",
            "sass-loader"
         ]
      }, {
         test: /\.useadble\.scss$/,
         use: [
            {
               loader: "style-loader/useable"
            },
            "css-loader",
            "sass-loader"
         ]
      }, {
         test: /\.css$/,
         loaders: ["style-loader", "css-loader"]
      }]
   },
   plugins: [
      new webpack.HotModuleReplacementPlugin()
   ],
   output: {
      publicPath: '/'
   },
   devtool: 'eval',
   devServer: {
      contentBase: path.join(__dirname, ".."),
      hot: true,
      port: 8088,
      noInfo: false,
      inline: true,
      historyApiFallback: true
   }
};

module.exports = merge(common, specific);
