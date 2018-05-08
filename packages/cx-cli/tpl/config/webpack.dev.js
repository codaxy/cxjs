const
    webpack = require("webpack"),
    merge = require("webpack-merge"),
    common = require("./webpack.config");

module.exports = merge(common, {
    mode: 'development',

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

    output: {
        publicPath: "/"
    },

    devtool: "eval",

    devServer: {
        hot: true,
        port: 8765,
        noInfo: false,
        inline: true,
        historyApiFallback: true
    }
});
