const webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    merge = require('webpack-merge'),
    path = require('path'),
    babelCfg = require("./babel.config"),
    paths = {
        app: p => path.join(__dirname, '../app/', p || ''),
        dist : p => path.join(__dirname, '../dist/', p || ''),
    };

module.exports = {
    resolve: {
        alias: {
            app: paths.app()
            //uncomment the line below to alias cx-react to cx-preact or some other React replacement library
            //'cx-react': 'cx-preact',
        }
    },

    module: {
        loaders: [{
            test: /\.js$/,
            //add here any ES6 based library
            include: /(app|cx)/,
            loader: 'babel-loader',
            query: babelCfg
        }, {
           test: /\.(png|jpg)/,
           loader: 'file-loader'
        }]
    },
    entry: {
        vendor: ['cx-react', paths.app('polyfill.js')],
        app: [
           paths.app('index.js')
        ]
    },
    output: {
        path: paths.dist(),
        filename: "[name].js"
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor"
        }),
        new HtmlWebpackPlugin({
            template: paths.app('index.html'),
            hash: true
        })
    ]
};


