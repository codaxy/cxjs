var cx = require('../../babel-plugin-transform-cx-jsx');

module.exports = {
   "presets": [
      ["env", {
         loose: true,
         modules: false
      }]
   ],
   "plugins": [
      "external-helpers",
      'transform-function-bind',
      'transform-object-rest-spread',
      cx,
      ["transform-react-jsx", {"pragma": "VDOM.createElement"}],

   ]
};

