var webpack = require('webpack'),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    merge = require('webpack-merge'),
    common = require('./webpack.config');

var sass = new ExtractTextPlugin({
    filename: "app.css",
    allChunks: true
});

var specific = {
    module: {
        loaders: [{
            test: /\.scss$/,
            loaders: sass.extract(['css', 'sass'])
        }, {
            test: /\.css$/,
            loaders: sass.extract(['css'])
        }]
    },

    plugins: [
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        sass
    ],

    output: {
        publicPath: '/starter/'
    }
};

module.exports = merge(common, specific);
