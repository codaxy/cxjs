let rollup = require('rollup'),
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
   let src = getPathResolver(srcPath);
   let dist = getPathResolver(distPath);
   let manifest = {};

   let all = entries.map(async (e) => {

      let options = Object.assign({
         treeshake: true,

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
                  return id.substring(0, 3) == 'cx/';
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
               path: srcPath //src('./' + e.name + '/')
            }),
            prettier({
               tabWidth: 2,
               printWidth: 120,
               useTabs: true
            })
            //buble(),
         ]
      }, e.options);

      try {
         let bundle = await rollup.rollup(options);

         let {output} = await bundle.generate({format: 'es', ...e.output});

         for (const chunkOrAsset of output) {
            if (chunkOrAsset.isAsset) {
               console.log('Unexpected asset', chunkOrAsset);
            } else {
               if (e.name) {
                  //let code = result.code.replace(/from '@\//g, "from './");
                  if (chunkOrAsset.code.length > 5) {
                     let code = chunkOrAsset.code.replace(/from "@\//g, "from \"./");
                     if (!fs.existsSync(distPath))
                        fs.mkdirSync(distPath);
                     fs.writeFileSync(dist(e.name + '.js'), code);
                     console.log(e.name + '.js', code.length, 'bytes');
                  }
               }
            }
         }

         // if (e.name) {
         //    await bundle.write({
         //       format: 'es',
         //       ...e.output,
         //       //dir: distPath
         //       file: dist(e.name + '.js')
         //    });
         //
         //    let stats = fs.statSync(dist(e.name + '.js'));
         //    let fileSizeInBytes = stats["size"];
         //
         //    console.log(e.name + '.js', fileSizeInBytes / 1000, 'kB');
         // }
      }
      catch (err) {
         console.error(err);
      }
   });

   return Promise
      .all(all)
      .then(() => {
         if (Object.keys(manifest).length > 0) {
            fs.writeFileSync(dist('manifest.js'), 'module.exports = ' + JSON.stringify(manifest, null, 2));
         }
      });
}
