module.exports = {
    "cacheDirectory": true,
    "cacheIdentifier": "1",
    "presets": [
        ["es2015", { loose: true }],
        "stage-0"
    ],
    "plugins": [
        ["transform-react-jsx", {"pragma": "VDOM.createElement"}],
        "cx"
    ]
};

