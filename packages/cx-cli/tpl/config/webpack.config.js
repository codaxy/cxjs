const webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    merge = require('webpack-merge'),
    path = require('path'),
    babelCfg = require("./babel.config"),
    p = p => path.join(__dirname, '../', p || '')

module.exports = {
    resolve: {
        alias: {
            app: p("app"),
            //uncomment the line below to alias cx-react to cx-preact or some other React replacement library
            //'cx-react': 'cx-preact',
        }
    },

    module: {
        loaders: [{
            test: /\.js$/,
            //add here any ES6 based library
            include: /[\\\/](app|cx|cx-react)[\\\/]/,
            loader: 'babel-loader',
            query: babelCfg
        }, {
           test: /\.(png|jpg)/,
           loader: 'file-loader'
        }]
    },
    entry: {
        vendor: ['cx-react', p('app/polyfill.js')],
        app: [
           p('app/index.js')
        ]
    },
    output: {
        path: p("dist"),
        filename: "[name].js"
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor"
        }),
        new HtmlWebpackPlugin({
            template: p('app/index.html'),
            hash: true
        })
    ]
};


