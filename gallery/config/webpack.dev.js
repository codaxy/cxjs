var webpack = require("webpack"),
   { merge } = require("webpack-merge"),
   common = require("./webpack.config"),
   path = require("path");

var specific = {
   module: {
      rules: [],
   },
   mode: "development",
   optimization: { moduleIds: "named" },
   output: {
      publicPath: "/",
   },
   devtool: "eval",
   devServer: {
      //contentBase: path.join(__dirname, ".."),
      hot: true,
      port: 8088,
      historyApiFallback: true,
   },
};

module.exports = merge(common(false), specific);
