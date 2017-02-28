// Custom Jest transform implementation that wraps babel-jest and injects our
// babel presets, so we don't have to use .babelrc.

module.exports = require('babel-jest').createTransformer({
    presets: ['env'],
    plugins: [
        'transform-object-rest-spread',
        "transform-function-bind",
        'transform-cx-jsx',
        ["transform-react-jsx", {"pragma": 'VDOM.createElement'}]
    ]
});

