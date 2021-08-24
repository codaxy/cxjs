const webpack = require("webpack"),
    MiniCssExtractPlugin = require("mini-css-extract-plugin"),
    HtmlWebpackPlugin = require("html-webpack-plugin"),
    { merge } = require("webpack-merge"),
    path = require("path"),
    CopyWebpackPlugin = require("copy-webpack-plugin"),
    { CleanWebpackPlugin } = require('clean-webpack-plugin'),
    ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin"),
    babelConfig = require("./babel-config"),
    gtm = require("../misc/tracking/gtm.js"),
    reactScriptsProd = require("../misc/reactScripts"),
    reactScriptsDev = require("../misc/reactScripts.dev");

var specific,
    production = process.env.npm_lifecycle_event.indexOf("build") == 0;

if (production) {
    var root = process.env.npm_lifecycle_event.indexOf(":root") != -1;

    specific = {
        mode: "production",
        target: ['web', 'es5'],
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
            new webpack.LoaderOptionsPlugin({
                options: {
                    "if-loader": "production",
                },
            }),
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
                        from: path.resolve(__dirname, "../misc/netlify.redirects"),
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
            new ScriptExtHtmlWebpackPlugin({
                //async: /\!(app|vendor).js$/,
                prefetch: {
                    test: /\.js$/,
                    chunks: "async",
                },
            }),
            new CleanWebpackPlugin()
        ],

        output: {
            path: path.join(__dirname, "dist"),
            filename: "[name].ltc.[chunkhash].js",
            chunkFilename: "[name].ltc.[chunkhash].js",
            hashDigestLength: 5,
            publicPath: root ? "/" : "/docs/",
        },
    };
} else {
    //dev
    specific = {
        mode: "development",
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
        entry: {
            app: ["react-dev-utils/webpackHotDevClient", __dirname + "/index.js"],
        },
        optimization: {
            moduleIds: "named",
        },
        plugins: [
            new webpack.LoaderOptionsPlugin({
                options: {
                    "if-loader": "development",
                },
            }),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.ProvidePlugin({
                process: "process/browser",
                Buffer: ["buffer", "Buffer"],
            }),
        ],
        output: {
            publicPath: "/",
        },
        devtool: "eval",
        performance: {
            hints: false,
        },
        devServer: {
            contentBase: "/docs",
            hot: true,
            port: 8065,
            noInfo: false,
            inline: true,
            historyApiFallback: true,
        },
    };
}

var common = {
    resolve: {
        alias: {
            "cx/src": path.resolve(path.join(__dirname, "../packages/cx/src")),
            "cx/locale": path.resolve(path.join(__dirname, "../packages/cx/locale")),
            cx: path.resolve(path.join(__dirname, "../packages/cx/src")),
            "cx-react": path.resolve(path.join(__dirname, "../packages/cx-react")),
            //'cx-react': path.resolve(path.join(__dirname, '../packages/cx-inferno')),
            //'cx-react': path.resolve(path.join(__dirname, '../packages/cx-preact')),
            "cx-react-css-transition-group": path.resolve(
                path.join(__dirname, "../packages/cx-react-css-transition-group")
            ),
            docs: __dirname,
        },
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                include: /[\\\/](misc|docs|cx|cx-react)[\\\/]/,
                //exclude: /(babelHelpers)/,
                use: [
                    {
                        loader: "babel-loader",
                        options: babelConfig({ production: production }),
                    },
                    {
                        loader: "if-loader",
                    },
                ],
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
    entry: {
        app: [
            //path.resolve(__dirname, "../misc/babelHelpers"),
            path.join(__dirname, "polyfill"),
            path.join(__dirname, "/index"),
        ],
    },
    output: {
        path: __dirname,
        filename: "[name].js",
    },
    externals: {
        react: "React",
        "react-dom": "ReactDOM",
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "index.html"),
            gtmh: gtm.head,
            gtmb: gtm.body,
            reactScripts: production ? reactScriptsProd : reactScriptsDev,
            favicon: path.join(__dirname, "img/favicon.png"),
            minify: {
                removeComments: true,
            },
        }),
        //new InlineManifestWebpackPlugin("manifest"),
    ],

    optimization: {
        splitChunks: {
            minChunks: 100,
        }
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
    }
};

module.exports = merge(common, specific);
