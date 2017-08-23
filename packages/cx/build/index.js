var rollup = require('rollup'),
   path = require('path'),
   fs = require('fs'),
   babel = require('rollup-plugin-babel'),
   babelConfig = require('./babel.config'),
   importAlias = require('./importAlias'),
   multiEntry = require('rollup-plugin-multi-entry'),
   scss = require('rollup-plugin-scss'),
   manifestRecorder = require('./manifestRecorder'),
   buble = require('rollup-plugin-buble'),
   pathResolve = require('./pathResolve'),
   prettier = require('rollup-plugin-prettier');


function getPath(basePath) {
   return function (x) {
      if (!x)
         return basePath;
      return pathResolve(basePath, x);
   }
}

var src = getPath(path.resolve(__dirname, '../src'));
var dist = getPath(path.resolve(__dirname, '../dist'));
var node_modules = getPath(path.resolve(__dirname, '../../../node_modules'));

var entries = [{
   name: 'util',
   options: {
      entry: [src('util/index.js')]
   },
   output: {}
}, {
   name: 'data',

   options: {
      entry: src('data/index.js')
   },
   output: {}
}, {
   name: 'ui',
   options: {
      entry: [src('ui/index.js')]
   },
   output: {}
}, {
   name: 'widgets',
   css: true,
   options: {
      entry: [src('widgets/index.js'), src('variables.scss'), src('widgets/index.scss')]
   },
   output: {}
}, {
   name: 'svg',
   css: true,
   options: {
      entry: [src('svg/index.js'), src('variables.scss'), src('svg/index.scss')]
   },
   output: {}
}, {
   name: 'charts',
   css: true,
   options: {
      entry: [src('charts/index.js'), src('variables.scss'), src('charts/index.scss')]
   },
   output: {}
}];

var paths = {
   [src('./util/')]: '@/util',
   [src('./data/')]: '@/data',
   [src('./ui/')]: '@/ui',
   [src('./widgets')]: '@/widgets',
   [src('./charts')]: '@/charts',
   [src('./svg/')]: '@/svg'
};

var manifest = {};

var all = entries.map(function(e) {

   // if (e.name != 'widgets')
   //    return null;

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
               //console.log('ISEXTERNAL', id);
               return id[0] == '@';
         }
      },
      plugins: [
         multiEntry(),
         scss({
            output: e.css && dist(e.name + '.css') || false
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
         bundle.generate(Object.assign({format: 'es'}, e.output))
            .then(result => {
               if (e.name) {
                  //var code = result.code.replace(/from '@\//g, "from './");
                  let code = result.code.replace(/from '@\//g, "from './");
                  fs.writeFileSync(dist(e.name + '.js'), code);
                  console.log(e.name + '.js', code.length / 1000, 'kB');
               }
            })
      })
      .catch(e => {
         console.log(e);
      });
});

Promise
   .all(all)
   .then(()=> {
      fs.writeFileSync(dist('manifest.js'), 'module.exports = ' + JSON.stringify(manifest, null, 2));
      //console.log(node_modules('cx/dist/manifest.js'));
      //fs.writeFileSync(node_modules('cx/dist/manifest.js'), 'module.exports = ' + JSON.stringify(manifest, null, 2));
      //console.log(manifest);
   });
