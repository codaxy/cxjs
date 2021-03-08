module.exports = function (context) {
   var opts = arguments[1] || {
      modules: false
   };

   let reactJsxOptions = {
      "runtime": "automatic"
   };

   if (opts.pragma) {
      reactJsxOptions = {
         pragma: opts.pragma
      };
   }

   var imports = !opts.cx || typeof opts.cx.imports == 'undefined' ? true : opts.cx.imports;
   var plugins = [];

   plugins.push(
      '@babel/proposal-class-properties',
      '@babel/proposal-function-bind',
      'transform-cx-jsx',
      ["@babel/transform-react-jsx", reactJsxOptions]
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
