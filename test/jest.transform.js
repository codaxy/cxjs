// Custom Jest transform implementation that wraps babel-jest and injects our
// babel presets, so we don't have to use .babelrc.

const babelJestMd = require('babel-jest');
const babelJest = babelJestMd.__esModule ? babelJestMd.default : babelJestMd;

module.exports = babelJest.createTransformer({
   "presets": [
      ["@babel/preset-env", { loose: true }]
   ],
   "plugins": [
      ["@babel/transform-react-jsx", { "runtime": "automatic" }],
      [
         "transform-cx-jsx",
         {
            autoImportHtmlElement: false, //adds cx/ based imports which cause double imports (dist + src)
            transformFunctionalComponents: false  //adds cx/ based imports which cause double imports (dist + src)
         }
      ],
      '@babel/proposal-object-rest-spread',
      "@babel/proposal-function-bind",
      '@babel/transform-parameters',
   ]
});

