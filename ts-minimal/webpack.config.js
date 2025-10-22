const webpack = require("webpack"),
   HtmlWebpackPlugin = require("html-webpack-plugin"),
   MiniCssExtractPlugin = require("mini-css-extract-plugin"),
   { merge } = require("webpack-merge"),
   path = require("path");

let production = process.env.npm_lifecycle_event && process.env.npm_lifecycle_event.indexOf("build") == 0;

let common = {
   resolve: {
      // alias: {
      //    cx: path.resolve(path.join(__dirname, "../packages/cx")),
      // },
      extensions: [".js", ".ts", ".tsx", ".json"],
   },

   module: {
      rules: [
         {
            test: /\.json$/,
            loader: "json-loader",
         },
         {
            test: /\.(js|jsx|ts|tsx)$/,
            //include: /(ts-minimal)/,
            loader: "ts-loader",
            options: {
               colors: false,
               logLevel: "info",
            },
         },
      ],
   },
   entry: {
      app: __dirname + "/index.tsx",
   },
   output: {
      path: __dirname,
      filename: "[name].js",
   },
   plugins: [
      //new webpack.optimize.CommonsChunkPlugin("vendor"),
      new HtmlWebpackPlugin({
         template: path.join(__dirname, "index.html"),
      }),
      // new CxScssManifestPlugin({
      //    outputPath: path.join(__dirname, "manifest.scss")
      // })
   ],
   stats: {
      usedExports: true,
   },
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

let specific;

if (production) {
   specific = {
      mode: "production",
      target: ["web", "es2015"], // Modern browsers for better tree-shaking
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
            filename: "app.css",
         }),
      ],

      output: {
         path: path.join(__dirname, "dist"),
         publicPath: ".",
      },

      optimization: {
         usedExports: true,
         sideEffects: false,
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
      mode: "development",
      //target: ["web", "es5"], //Uncomment for IE testing
      plugins: [
         new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify("development"),
            "process.env.NODE_DEBUG": JSON.stringify(false),
         }),
      ],
      output: {
         publicPath: "/",
      },
      performance: {
         hints: false,
      },
      devtool: "eval",
      devServer: {
         //contentBase: "/",
         hot: true,
         port: 8090,
         //noInfo: false,
         //inline: true,
         historyApiFallback: true,
         //quiet: true
      },
   };
}

module.exports = merge(common, specific);
