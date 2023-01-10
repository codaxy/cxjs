module.exports = function (context) {
   let opts = arguments[1] || {
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

   let cx = opts.cx || {};
   let imports = typeof cx.imports == 'undefined' ? true : cx.imports;
   let plugins = [];

   plugins.push(
      '@babel/proposal-class-properties',
      '@babel/proposal-function-bind',
      ['transform-cx-jsx', cx.jsx],
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
