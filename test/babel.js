require("babel-core/register")({
   retainLines: true,
   "presets": [
      ["es2015", {loose: true}],
      "stage-0"
   ],
   "plugins": [
      ["babel-plugin-transform-react-jsx", {"pragma": "VDOM.createElement"}],
      "babel-plugin-cx"
   ]
});