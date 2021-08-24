const webpack = require("webpack"),
   MiniCssExtractPlugin = require("mini-css-extract-plugin"),
   HtmlWebpackPlugin = require("html-webpack-plugin"),
   CopyWebpackPlugin = require("copy-webpack-plugin"),
   { CleanWebpackPlugin } = require("clean-webpack-plugin"),
   BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin,
   { merge } = require("webpack-merge"),
   path = require("path"),
   gtm = require("../misc/tracking/gtm.js"),
   reactScriptsProd = require("../misc/reactScripts"),
   reactScriptsDev = require("../misc/reactScripts.dev");

let root = process.env.npm_lifecycle_event.indexOf(":root") != -1;
let production = process.env.npm_lifecycle_event.indexOf("build") == 0;

var common = {
   mode: production ? "production" : "development",
   target: ['web', 'es5'],
   resolve: {
      alias: {
         fiddle: __dirname,
         app: path.join(__dirname, "app/"),
         config: path.join(__dirname, "app/config/dev/"),
         path: "path-browserify",
      },
      fallback: {
         fs: false,
         //module: false,
         net: false,
         util: false,
         buffer: false,
         "safe-buffer": false,
      },
      fullySpecified: false,
   },

   module: {
      rules: [
         {
            test: /\.(js)$/,
            include: [
               path.resolve(__dirname, "./app"),
               path.resolve(__dirname, "../misc"),
               /node_modules[\\\/](cx|cx-react)[\\\/]/,
            ],
            //include: /[\\\/](app|cx-react|prettier|babel|@babel)/,
            loader: "babel-loader",
            options: {
               cacheDirectory: true,
               presets: [
                  [
                     "cx-env",
                     {
                        targets: {
                           chrome: 45,
                           ie: 11,
                           firefox: 30,
                           edge: 12,
                           safari: 9,
                        },
                        modules: false,
                        loose: true,
                        corejs: 3,
                        useBuiltIns: "usage",
                        cx: {
                           imports: true,
                        },
                     },
                  ],
               ],
            },
         },
         {
            test: /\.(png|jpg|svg)/,
            loader: "file-loader",
            options: {
               name: "[name].ltc.[hash].[ext]",
            },
         },
      ],
   },
   //  node: {
   //     fs: "empty",
   //     module: "empty",
   //     net: "empty",
   //  },
   entry: {
      app: __dirname + "/app/index.js",
   },
   externals: {
      react: "React",
      "react-dom": "ReactDOM",
   },
   output: {
      path: __dirname,
      //publicPath: '/',
      filename: "[name].js",
   },
   plugins: [
      new HtmlWebpackPlugin({
         template: path.join(__dirname, "app/index.html"),
         gtmh: gtm.head,
         gtmb: gtm.body,
         reactScripts: production ? reactScriptsProd : reactScriptsDev,
      }),
      new webpack.ProvidePlugin({
         process: "process/browser",
         Buffer: ["buffer", "Buffer"],
      }),
   ],
   cache: {
      // 1. Set cache type to filesystem
      type: "filesystem",

      buildDependencies: {
         // 2. Add your config as buildDependency to get cache invalidation on config change
         config: [__filename],

         // 3. If you have other things the build depends on you can add them here
         // Note that webpack, loaders and all modules referenced from your config are automatically added
      },
   },
};

var specific;

if (production) {
   specific = {
      resolve: {
         alias: {
            config: path.join(__dirname, "app/config/prod/"),
         },
      },

      module: {
         rules: [
            {
               test: /\.scss$/,
               use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
            },
            {
               test: /\.css$/,
               use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
         ],
      },

      plugins: [
         new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify("production"),
         }),
         new MiniCssExtractPlugin({
            filename: "app.ltc.[chunkhash].css",
            chunkFilename: "[id].ltc.[chunkhash].css",
         }),
         new CopyWebpackPlugin({
            patterns: [
               {
                  from: path.join(__dirname, "assets"),
                  to: path.join(__dirname, "dist/assets"),
               },
               {
                  from: path.resolve(__dirname, "./netlify.redirects"),
                  to: "_redirects",
                  toType: "file",
               },
               {
                  from: path.resolve(__dirname, "../misc/netlify.headers"),
                  to: "_headers",
                  toType: "file",
               },
            ],
         }),
         new CleanWebpackPlugin(),
         //new BundleAnalyzerPlugin()
      ],

      output: {
         path: path.join(__dirname, "dist"),
         publicPath: "/",
         filename: "[name].ltc.[chunkhash].js",
         chunkFilename: "[name].ltc.[chunkhash].js",
         hashDigestLength: 5,
      },

      optimization: {
         splitChunks: false,
      },
   };
} else {
   specific = {
      module: {
         rules: [
            {
               test: /\.scss$/,
               use: ["style-loader", "css-loader", "sass-loader"],
            },
            {
               test: /\.css$/,
               use: ["style-loader", "css-loader"],
            },
         ],
      },
      plugins: [new webpack.HotModuleReplacementPlugin()],
      devtool: "eval",
      devServer: {
         //contentBase: '/assets/',
         hot: true,
         port: 8089,
         noInfo: false,
         historyApiFallback: true,
      },
   };
}

module.exports = merge(common, specific);
