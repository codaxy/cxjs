module.exports = {
    "cacheDirectory": true,
    "cacheIdentifier": "v7",
    "presets": [
        ["es2015", { loose: true }],
        "stage-0"
    ],
    "plugins": [
        "babel-plugin-cx",
        ["babel-plugin-transform-react-jsx", {"pragma": "VDOM.createElement"}]
        //["babel-plugin-inferno", {"pragma": "VDOM"}]
    ]
};

