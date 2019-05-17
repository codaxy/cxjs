

module.exports = function (options) {
    var isProduction = options.production;

    return {
        "cacheDirectory": true,
        "cacheIdentifier": "v16",
        "presets": [
            ["@babel/preset-env", {
                loose: true,
                modules: false,
                useBuiltIns: "usage",
                corejs: 3,
                targets: {
                    chrome: 55,
                    ie: 11,
                    firefox: 30,
                    edge: 12,
                    safari: 9
                }
            }]
        ],
        "plugins": [
            ['transform-cx-jsx', {
                trimWhitespace: true,
                trimWhitespaceExceptions: ['Md', 'CodeSnippet', 'CodeSplit']
            }],
            ["@babel/transform-react-jsx", {"pragma": 'VDOM.createElement'}],
            //'@babel/external-helpers',
            '@babel/proposal-object-rest-spread',
            "@babel/proposal-function-bind",
            '@babel/transform-parameters',
            '@babel/syntax-dynamic-import',
            "@babel/plugin-proposal-export-namespace-from",
            isProduction && ["transform-cx-imports", {useSrc: true}],
        ].filter(Boolean)
    }
};


