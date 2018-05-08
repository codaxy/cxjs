var webpack = require("webpack"),
    merge = require("webpack-merge"),
    common = require("./webpack.config");

var specific = {
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
        port: 8088,
        noInfo: false,
        inline: true,
        historyApiFallback: true
    }
};

module.exports = merge(common, specific);
