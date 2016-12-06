module.exports = function(context) {
   let opts = arguments[1] || {};
   var pragma = opts.pragma || "VDOM.createElement";
   var imports = !opts.cx || typeof opts.cx.imports == 'undefined' ? true : opts.cx.imports;

   return {
      presets: [['babel-preset-env', opts]],
      plugins: [
         ['transform-cx-imports', imports],
         'transform-object-rest-spread',
         "transform-function-bind",
         'cx',
         ["transform-react-jsx", {"pragma": pragma}]
      ]
   };
};
