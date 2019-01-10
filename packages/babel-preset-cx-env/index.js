module.exports = function (context) {
   var opts = arguments[1] || {
         modules: false
      };

   var pragma = opts.pragma || "VDOM.createElement";
   var imports = !opts.cx || typeof opts.cx.imports == 'undefined' ? true : opts.cx.imports;
   var plugins = [];

   plugins.push(
      'transform-class-properties',
      'transform-object-rest-spread',
      'transform-function-bind',
      'transform-cx-jsx',
      'transform-es2015-parameters',
      'transform-export-extensions',
      'syntax-dynamic-import',
      ["transform-react-jsx", {"pragma": pragma}]
   );

   if (imports !== false) {
      if (typeof imports == 'object')
         plugins.push(['transform-cx-imports', imports]);
      else
         plugins.push('transform-cx-imports');
   }

   return {
      presets: [['babel-preset-env', opts]],
      plugins: plugins
   };
};
