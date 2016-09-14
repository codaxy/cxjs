const webpack = require('webpack'),
    ExtractTextPlugin = require("extract-text-webpack-plugin");

var sass = new ExtractTextPlugin("Cx.dev.css", {
   allChunks: true
});

module.exports = [{
   module: {
      loaders: [{
         test: /\.js$/,
         include: /(cx-core|intl-io)/,
         loader: 'babel',
         query: {
            cacheDirectory: true,
            cacheIdentifier: '6'
         }
      }, {
         test: /\.scss$/,
         loader: sass.extract(['css', 'sass'])
      }]
   },
   plugins: [
      sass
   ],
   externals: {
      "react": "React",
      "react-dom": "ReactDOM"
   },
   entry: {
      dev: __dirname + '/packages/cx-core/src/index.js'
   },
   output: {
      path: __dirname + "/packages/cx-core/src/dist",
      filename: "Cx.[name].js",
      library: 'Cx',
      libraryTarget: 'umd'
   }
}];
