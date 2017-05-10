const webpack = require('webpack'),
   HtmlWebpackPlugin = require('html-webpack-plugin'),
   merge = require('webpack-merge'),
   path = require('path'),
   babelCfg = require("./babel.config"),
   p = p => path.join(__dirname, '../', p || '')

module.exports = {
   resolve: {
      alias: {
         app: p("."),
         "cx/src": p("../packages/cx/src"),
         cx: p("../packages/cx"),
         "cx-react": p("../packages/cx-react"),
         "cx-theme-material": p("../packages/cx-theme-material"),
         "cx-theme-frost": p("../packages/cx-theme-frost"),
         "cx-theme-dark": p("../packages/cx-theme-dark")
         //uncomment the line below to alias cx-react to cx-preact or some other React replacement library
         //'cx-react': 'cx-preact',
      },
      extensions: [".js", ".ts", ".tsx"]
   },

   module: {
      loaders: [{
         test: /\.tsx?$/,
         include: /gallery/,
         loaders: [
            {
               loader: 'babel-loader',
               query: babelCfg
            },
            'ts-loader',
         ]
      }, {
         test: /\.js$/,
         //add here any ES6 based library
         include: /(cx|gallery)/,
         loader: 'babel-loader',
         query: babelCfg
      }, {
         test: /\.(png|jpg)/,
         loader: 'file-loader'
      }, {
         test: /\.scss$/,
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
   entry: {
      vendor: ['cx-react', p('polyfill.js')],
      app: [
         p('index')
      ]
   },
   output: {
      path: p("dist"),
      filename: "[name].js"
   },
   plugins: [
      new webpack.optimize.CommonsChunkPlugin({
         name: "vendor"
      }),
      new HtmlWebpackPlugin({
         template: p('index.html'),
         hash: true
      })
   ]
};


