

module.exports = function (options) {
    var isProduction = options.production

    return {
        "cacheDirectory": true,
        "cacheIdentifier": "v9",
        "presets": [
            ["env", {
                loose: true,
                modules: false,
                useBuiltIns: true,
                targets: {
                    chrome: 45,
                    ie: 11,
                    ff: 30,
                    edge: 12,
                    safari: 9
                }
            }]
        ],
        "plugins": [
            'transform-object-rest-spread',
            "transform-function-bind",
            'transform-export-extensions',
            ["transform-cx-imports", {useSrc: isProduction}],
            'transform-cx-jsx',
            ["transform-react-jsx", {"pragma": 'VDOM.createElement'}],
            //["babel-plugin-inferno", {"pragma": "VDOM"}]
        ]
    }
};


