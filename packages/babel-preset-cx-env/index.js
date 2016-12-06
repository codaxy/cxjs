var modifyBabelPreset = require('modify-babel-preset');

module.exports = (options, opts) => {

   opts = opts || {};
   var pragma = opts.pragma || "VDOM.createElement";
   var imports = !opts.cx || typeof opts.cx.imports == 'undefined' ? true : opts.cx.imports;

   return modifyBabelPreset(
      ['env', opts],
      {
         'transform-cx-imports': imports,
         'transform-object-rest-spread': true,
         "transform-function-bind": true,
         'cx': true,
         "transform-react-jsx": {"pragma": pragma}
      }
   );
};
