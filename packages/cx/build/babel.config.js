var cx = require('../../babel-plugin-transform-cx-jsx');

module.exports = {
   "presets": [
      ["es2015", { loose: true, modules: false }],
      "stage-0"
   ],
   "plugins": [
      "external-helpers",
      'transform-function-bind',
      'transform-object-rest-spread',
      cx,
      ["transform-react-jsx", {"pragma": "VDOM.createElement"}],

   ]
};

