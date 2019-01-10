const HtmlWebpackPlugin = require('html-webpack-plugin'),
   InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin'),
   ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin'),
   merge = require('webpack-merge'),
   path = require('path'),
   babelCfg = require("./babel.config"),
   p = p => path.join(__dirname, '../', p || ''),
   gtm = require('../../misc/tracking/gtm.js'),
   reactScripts = require('../../misc/reactScripts'),
   reactScriptsDev = require('../../misc/reactScripts.dev.js');

module.exports = (production) => ({
   resolve: {
      alias: {
         app: p("."),
         "cx/src": p("../packages/cx/src"),
         cx: p("../packages/cx"),
         "cx-react": p("../packages/cx-react"),
         "cx-theme-material": p("../packages/cx-theme-material"),
         "cx-theme-frost": p("../packages/cx-theme-frost"),
         "cx-theme-dark": p("../packages/cx-theme-dark"),
         "cx-theme-aquamarine": p("../packages/cx-theme-aquamarine")
         //uncomment the line below to alias cx-react to cx-preact or some other React replacement library
         //'cx-react': 'cx-preact',
      },
      extensions: [".js", ".ts", ".tsx", ".json"]
   },

   module: {
      rules: [{
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
         include: /[\\\/](cx|cx-react|gallery|cx-theme-material|cx-theme-frost|cx-theme-dark)[\\\/]/,
         loader: 'babel-loader',
         query: babelCfg
      }, {
         test: /\.(png|jpg|svg)/,
         loader: 'file-loader',
         options: {
            name: '[path][name].ltc.[hash].[ext]'
         }
      }, {
         test: /\.scss$/,
         use: [
            {
               loader: "style-loader/useable",
               options: {
                  sourceMap: !production
               }
            },
            {
               loader: "css-loader",
               options: {
                  sourceMap: !production
               }
            },
            {
               loader: "sass-loader",
               options: {
                  sourceMap: !production
               }
            }
         ]
      }, {
         test: /\.css$/,
         loaders: ["style-loader", "css-loader"]
      }]
   },
   entry: {
      //vendor: ['cx-react', p('polyfill.js')],
      app: [
         p('../misc/babelHelpers'),
         p('entry')
      ]
   },
   output: {
      path: p("dist"),
      filename: "[name].js"
   },
   externals: {
      "react": "React",
      "react-dom": "ReactDOM"
   },

   optimization: {
      runtimeChunk: 'single'
   },

   plugins: [
      new HtmlWebpackPlugin({
         template: p('index.html'),
         gtmh: gtm.head,
         gtmb: gtm.body,
         reactScripts: production ? reactScripts : reactScriptsDev,
         favicon: p('assets/favicon.png'),
      }),
      new InlineManifestWebpackPlugin(),
      new ScriptExtHtmlWebpackPlugin({
         async: /\.js$/,
         preload: {
            test: /(material)/,
            chunks: 'async'
         },
         prefetch: {
            test: /\.js$/,
            chunks: 'async'
         }
      })
   ]
});


