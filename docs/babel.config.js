

module.exports = function (options) {
    var isProduction = options.production;

    return {
        "cacheDirectory": true,
        "cacheIdentifier": "v16",
        "presets": [
            ["env", {
                loose: true,
                modules: false,
                useBuiltIns: "entry",
                targets: {
                    chrome: 55,
                    ie: 11,
                    ff: 30,
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
            ["transform-react-jsx", {"pragma": 'VDOM.createElement'}],
            'external-helpers',
            'transform-object-rest-spread',
            "transform-function-bind",
            'transform-export-extensions',
            'transform-es2015-parameters',
            'syntax-dynamic-import',
            isProduction && ["transform-cx-imports", {useSrc: true}],
        ].filter(Boolean)
    }
};


