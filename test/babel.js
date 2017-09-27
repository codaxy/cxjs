require("babel-core/register")({
   retainLines: true,
   "presets": [
      ["env", {loose: true}]
   ],
   "plugins": [
      ["babel-plugin-transform-react-jsx", {"pragma": "VDOM.createElement"}],
      "babel-plugin-transform-cx-jsx",
      'transform-object-rest-spread',
      "transform-function-bind",
      'transform-export-extensions',
      'transform-es2015-parameters',
   ]
});