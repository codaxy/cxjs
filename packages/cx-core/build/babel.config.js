module.exports = {
   "presets": [
      ["es2015", { loose: true, modules: false }],
      "stage-0"
   ],
   "plugins": [
      "external-helpers",
      "cx",
      ["transform-react-jsx", {"pragma": "VDOM.createElement"}]
   ]
};

