const webpack = require("webpack"),
  MiniCssExtractPlugin = require("mini-css-extract-plugin"),
  HtmlWebpackPlugin = require("html-webpack-plugin"),
  CopyWebpackPlugin = require("copy-webpack-plugin"),
  ChunkManifestPlugin = require("chunk-manifest-webpack-plugin"),
  WebpackCleanupPlugin = require("webpack-cleanup-plugin"),
  BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
    .BundleAnalyzerPlugin;
(merge = require("webpack-merge")), (path = require("path"));

let root = process.env.npm_lifecycle_event.indexOf(":root") != -1;
let production = process.env.npm_lifecycle_event.indexOf("build") == 0;

var common = {
  mode: production ? "production" : "development",
  resolve: {
    alias: {
      fiddle: __dirname,
      app: path.join(__dirname, "app/"),
      config: path.join(__dirname, "app/config/dev/")
    }
  },

  module: {
    rules: [
      {
        test: /\.(js|mjs)$/,
        //include: /[\\\/](app|cx-react|prettier|babel|@babel)/,
        loader: "babel-loader",
        query: {
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
                  safari: 9
                },
                modules: false,
                loose: true,
                corejs: 3,
                useBuiltIns: "usage",
                cx: {
                  imports: true
                }
              }
            ]
          ]
        }
      }
    ]
  },
  node: {
    fs: "empty",
    module: "empty",
    net: "empty"
  },
  entry: {
    app: __dirname + "/app/index.js"
  },
  externals: {
    react: "React",
    "react-dom": "ReactDOM"
  },
  output: {
    path: __dirname,
    //publicPath: '/',
    filename: "[name].js"
  },
  plugins: [
    // new ChunkManifestPlugin({
    //   manifestVariable: "webpackManifest",
    //   inlineManifest: true
    // }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "app/index.html")
    })
  ]
};

var specific;

if (production) {
  specific = {
    resolve: {
      alias: {
        config: path.join(__dirname, "app/config/prod/")
      }
    },

    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, "css-loader"]
        }
      ]
    },

    plugins: [
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify("production")
      }),
      new MiniCssExtractPlugin({
        filename: "app.ltc.[chunkhash].css",
        chunkFilename: "[id].ltc.[chunkhash].css"
      }),
      new CopyWebpackPlugin([
        {
          from: path.join(__dirname, "assets"),
          to: path.join(__dirname, "dist/assets")
        },
        {
          from: path.resolve(__dirname, "./netlify.redirects"),
          to: "_redirects",
          toType: "file"
        }
      ]),
      //new WebpackCleanupPlugin(),
      new BundleAnalyzerPlugin()
    ],

    output: {
      path: path.join(__dirname, "dist"),
      publicPath: root ? "/" : "/fiddle/",
      filename: "[name].ltc.[chunkhash].js",
      chunkFilename: "[name].ltc.[chunkhash].js",
      hashDigestLength: 5
    },

    optimization: {
      splitChunks: false
    }
  };
} else {
  specific = {
    module: {
      rules: [
        {
          test: /\.scss$/,
          loaders: ["style-loader", "css-loader", "sass-loader"]
        },
        {
          test: /\.css$/,
          loader: ["style-loader", "css-loader"]
        }
      ]
    },
    plugins: [new webpack.HotModuleReplacementPlugin()],
    devtool: "eval",
    devServer: {
      //contentBase: '/assets/',
      hot: true,
      port: 8089,
      noInfo: false,
      historyApiFallback: true
    }
  };
}

module.exports = merge(common, specific);
