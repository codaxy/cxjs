require("@babel/register")({
   retainLines: true,
   "presets": [
      ["@babel/preset-env", {loose: true}]
   ],
   "plugins": [
      ["@babel/transform-react-jsx", {"pragma": "VDOM.createElement"}],
      "transform-cx-jsx",
      '@babel/proposal-object-rest-spread',
      "@babel/proposal-function-bind",
      '@babel/transform-parameters',
   ]
});