const
    webpack = require('webpack'),
    MiniCssExtractPlugin = require("mini-css-extract-plugin"),
    CopyWebpackPlugin = require("copy-webpack-plugin"),
    { merge } = require("webpack-merge"),
    common = require("./webpack.config"),
    path = require("path"),
    p = p => path.join(__dirname, "../", p || "");

module.exports = merge(common, {
    mode: 'production',

    output: {
        path: p("dist"),
        publicPath: "/",
        filename: "[name].[chunkhash].js",
        chunkFilename: "[name].[chunkhash].js",
        hashDigestLength: 6
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
            filename: "[name].[hash].css",
            chunkFilename: "[name].[hash].css"
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: p("./assets"),
                    to: p("./dist/assets")
                }
            ]
        })
    ]
});
