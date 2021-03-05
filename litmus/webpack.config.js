const webpack = require("webpack"),
   HtmlWebpackPlugin = require("html-webpack-plugin"),
   CxScssManifestPlugin = require("../packages/cx-scss-manifest-webpack-plugin/src/index"),
   BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
      .BundleAnalyzerPlugin,
   { merge } = require("webpack-merge"),
   path = require("path"),
   babelConfig = require("./babel-config");

let production =
   process.env.npm_lifecycle_event &&
   process.env.npm_lifecycle_event.indexOf("build") == 0;

let common = {
   resolve: {
      alias: {
         cx: path.resolve(path.join(__dirname, "../packages/cx")),
         //'cx-react': path.resolve(path.join(__dirname, '../packages/cx-react')),
         //'cx-react': path.resolve(path.join(__dirname, '../packages/cx-preact')),
         //'cx-react': path.resolve(path.join(__dirname, '../packages/cx-inferno')),
         litmus: __dirname
      },
      extensions: [".js", ".ts", ".tsx", ".json"]
   },

   module: {
      rules: [
         {
            test: /\.json$/,
            loader: "json-loader"
         },
         {
            test: /\.(js|ts|tsx)$/,
            include: /(litmus|cx)/,
            loader: "babel-loader",
            options: babelConfig(production)
         }
      ]
   },
   entry: {
      // vendor: [
      //    'babel-polyfill',
      //    'cx-react'
      // ],
      app: __dirname + "/index.js"
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
         template: path.join(__dirname, "index.html")
      }),
      // new CxScssManifestPlugin({
      //    outputPath: path.join(__dirname, "manifest.scss")
      // })
   ],
   stats: {
      usedExports: true
   },
   cache: {
      // 1. Set cache type to filesystem
      type: 'filesystem',

      buildDependencies: {
         // 2. Add your config as buildDependency to get cache invalidation on config change
         config: [__filename],

         // 3. If you have other things the build depends on you can add them here
         // Note that webpack, loaders and all modules referenced from your config are automatically added
      },
   },
};

let specific;

if (production) {
   let sass = new ExtractTextPlugin({
      filename: "app.css",
      allChunks: true
   });
   specific = {
      mode: "production",
      target: ['web', 'es5'], //IE 11
      module: {
         rules: [
            {
               test: /\.scss$/,
               loaders: sass.extract(["css-loader", "sass-loader"])
            },
            {
               test: /\.css$/,
               loaders: sass.extract(["css-loader"])
            }
         ]
      },

      plugins: [
         new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify("production")
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
         path: path.join(__dirname, "dist"),
         publicPath: "."
      }
   };
} else {
   specific = {
      module: {
         rules: [
            {
               test: /\.scss$/,
               use: ["style-loader", "css-loader", "sass-loader"]
            },
            {
               test: /\.css$/,
               use: ["style-loader", "css-loader"]
            }
         ]
      },
      mode: "development",
      target: ['web', 'es5'], //Uncomment for IE testing
      plugins: [
         new webpack.HotModuleReplacementPlugin(),
         new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify("development")
         })
      ],
      output: {
         publicPath: "/"
      },
      performance: {
         hints: false
      },
      devtool: false,
      devServer: {
         contentBase: "/",
         hot: true,
         port: 8085,
         noInfo: false,
         inline: true,
         historyApiFallback: true
         //quiet: true
      }
   };
}

module.exports = merge(common, specific);
