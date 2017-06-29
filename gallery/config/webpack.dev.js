var webpack = require('webpack'),
   merge = require('webpack-merge'),
   common = require('./webpack.config'),
   path = require("path");

var specific = {
   module: {
      loaders: []
   },
   plugins: [
      new webpack.NamedModulesPlugin(),
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

module.exports = merge(common(false), specific);
