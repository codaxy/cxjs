const
    HtmlWebpackPlugin = require("html-webpack-plugin"),
    path = require("path"),
    babelCfg = require("./babel.config"),
    p = p => path.join(__dirname, "../", p || "");

module.exports = {
    resolve: {
        alias: {
            app: p("app")
            //uncomment the line below to alias cx-react to cx-preact or some other React replacement library
            //'cx-react': 'cx-preact',
        }
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                //add here any ES6 based library
                include: /[\\\/](app|cx|cx-react|cx-theme-\w*)[\\\/]/,
                use: {
                    loader: "babel-loader",
                    options: babelCfg
                }
            },
            {
                test: /\.(png|jpg)/,
                use: "file-loader"
            }
        ]
    },
    entry: {
        vendor: ["cx-react", p("app/polyfill.js")],
        app: [p("app/index.js")]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: p("app/index.html")
        }),
    ],
    optimization: {
        runtimeChunk: 'single'
    },
    cache: {
        type: 'filesystem',

        buildDependencies: {
            config: [
                __filename,
                p('config/webpack.dev.js'),
                p('config/webpack.prod.js'),
                p('config/babel.config.js')
            ]
        }
    }
};
