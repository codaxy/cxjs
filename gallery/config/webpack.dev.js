var webpack = require("webpack"),
   { merge } = require("webpack-merge"),
   common = require("./webpack.config"),
   path = require("path");

var specific = {
   // module: {
   //    rules: [],
   // },
   mode: "development",
   //optimization: { moduleIds: "named" },
   output: {
      publicPath: "/",
      path: path.join(__dirname, ".."), //required for unknown reasons
   },
   //devtool: "eval",
   devServer: {
      //static: path.join(__dirname, ".."),
      hot: true,
      port: 8088,
      historyApiFallback: true,
   },
};

const configuration = merge(common(false), specific);

console.log(configuration);
module.exports = configuration;
