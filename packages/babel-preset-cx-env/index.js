module.exports = function (context) {
   var opts = arguments[1] || {
         modules: false
      };

   var pragma = opts.pragma || "VDOM.createElement";
   var imports = !opts.cx || typeof opts.cx.imports == 'undefined' ? true : opts.cx.imports;
   var plugins = [];

   if (imports !== false) {
      if (typeof imports == 'object')
         plugins.push(['transform-cx-imports', imports]);
      else
         plugins.push('transform-cx-imports');
   }

   plugins.push(
      'transform-object-rest-spread',
      "transform-function-bind",
      'cx',
      ["transform-react-jsx", {"pragma": pragma}]
   );

   return {
      presets: [['babel-preset-env', opts]],
      plugins: plugins
   };
};
