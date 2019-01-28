module.exports = function (context) {
   var opts = arguments[1] || {
         modules: false
      };

   var pragma = opts.pragma || "VDOM.createElement";
   var imports = !opts.cx || typeof opts.cx.imports == 'undefined' ? true : opts.cx.imports;
   var plugins = [];

   plugins.push(
      '@babel/proposal-class-properties',
      '@babel/proposal-object-rest-spread',
      '@babel/proposal-function-bind',
      'transform-cx-jsx',
      '@babel/transform-parameters',
      '@babel/syntax-dynamic-import',
      ["@babel/transform-react-jsx", {"pragma": pragma}]
   );

   if (imports !== false) {
      if (typeof imports == 'object')
         plugins.push(['transform-cx-imports', imports]);
      else
         plugins.push('transform-cx-imports');
   }

   delete opts.cx;

   return {
      presets: [['@babel/preset-env', opts]],
      plugins: plugins
   };
};
