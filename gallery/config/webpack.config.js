const webpack = require('webpack'),
   HtmlWebpackPlugin = require('html-webpack-plugin'),
   PreloadWebpackPlugin = require('preload-webpack-plugin'),
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
         "cx-theme-dark": p("../packages/cx-theme-dark")
         //uncomment the line below to alias cx-react to cx-preact or some other React replacement library
         //'cx-react': 'cx-preact',
      },
      extensions: [".js", ".ts", ".tsx", ".json"]
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
   plugins: [
      new webpack.NamedChunksPlugin(chunk => {
         if (chunk.name)
            return chunk.name;

         // if (chunk.entryModule)
         //    console.log('CHUNK', chunk.entryModule.resource);
         // else
         //    console.log('CH', chunk.modules.map(x=>x.resource));

         if (chunk.modules.some(m => m.resource.match(/themes.material\.js$/)))
            return 'material';

         if (chunk.modules.some(m => m.resource.match(/themes.frost\.js$/)))
            return 'frost';

         if (chunk.modules.some(m => m.resource.match(/themes.core\.js$/)))
            return 'core';

         if (chunk.modules.some(m => m.resource.match(/themes.dark\.js$/)))
            return 'dark';

         if (chunk.modules.some(m => m.resource.match(/polyfill\.js$/)))
            return 'polyfill';

         return chunk.name;
      }),
      // new webpack.optimize.CommonsChunkPlugin({
      //    name: "vendor"
      // }),
      new HtmlWebpackPlugin({
         template: p('index.html'),
         gtmh: gtm.head,
         gtmb: gtm.body,
         reactScripts: production ? reactScripts : reactScriptsDev
      }),
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


