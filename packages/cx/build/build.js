var rollup = require('rollup'),
   path = require('path'),
   fs = require('fs'),
   babel = require('rollup-plugin-babel'),
   babelConfig = require('./babel.config'),
   importAlias = require('./importAlias'),
   multiEntry = require('rollup-plugin-multi-entry'),
   scss = require('./rollup-plugin-scss'),
   manifestRecorder = require('./manifestRecorder'),
   buble = require('rollup-plugin-buble'),
   getPathResolver = require('./getPathResolver'),
   prettier = require('rollup-plugin-prettier');


module.exports = function build(srcPath, distPath, entries, paths, externals) {
   var src = getPathResolver(srcPath);
   var dist = getPathResolver(distPath);
   var manifest = {};

   var all = entries.map(function (e) {
      var options = Object.assign({
         treeshake: true,
         sourceMap: false,
         external: function (id) {

            if (id.indexOf('babel') == 0)
               throw new Error('Babel stuff detected: ' + id);

            switch (id) {
               case 'route-parser':
               case 'cx-react':
               case 'intl-io':
                  return true;

               default:
                  if (externals && externals.indexOf(id) >= 0)
                     return true;
                  //console.log('ISEXTERNAL', id);
                  return id[0] == '@';
            }
         },
         plugins: [
            multiEntry(),
            scss({
               output: e.css && dist(e.name + '.css') || false,
               importer: function (name, prev, done) {
                  if (name.indexOf("~cx/") == 0) {
                     let resolvedFile = '../../cx/' + name.substring(4);
                     return {
                        file: resolvedFile
                     };
                  }
               }
            }),
            babel({
               presets: babelConfig.presets,
               plugins: [
                  ...babelConfig.plugins,
                  manifestRecorder(manifest, paths, src('.'))
               ]
            }),
            importAlias({
               paths: paths,
               path: src('./' + e.name + '/')
            }),
            prettier({
               tabWidth: 2,
               printWidth: 120,
               useTabs: true
            })
            //buble(),
         ]
      }, e.options);

      return rollup
         .rollup(options)
         .then(function (bundle) {
            bundle
               .generate(Object.assign({format: 'es'}, e.output))
               .then(result => {
                  if (e.name) {
                     //var code = result.code.replace(/from '@\//g, "from './");
                     if (result.code.length > 5) {
                        let code = result.code.replace(/from "@\//g, "from \"./");
                        if (!fs.existsSync(distPath))
                           fs.mkdirSync(distPath);
                        fs.writeFileSync(dist(e.name + '.js'), code);
                        console.log(e.name + '.js', code.length / 1000, 'kB');
                     }
                  }
               })
         })
         .catch(e => {
            console.log(e);
         });
   });

   return Promise
      .all(all)
      .then(() => {
         if (Object.keys(manifest).length > 0) {
            fs.writeFileSync(dist('manifest.js'), 'module.exports = ' + JSON.stringify(manifest, null, 2));
         }
      });
}
