var rollup = require('rollup'),
   path = require('path'),
   fs = require('fs'),
   babel = require('rollup-plugin-babel'),
   babelConfig = require('./babel.config'),
   importAlias = require('./importAlias'),
   multiEntry = require('rollup-plugin-multi-entry');


function getPath(basePath) {
   return function (x) {
      if (!x)
         return basePath;
      return path.resolve(basePath, x);
   }
}

var src = getPath(path.resolve(__dirname, '../src'));
var dist = getPath(path.resolve(__dirname, '../dist'));

const endsWith = (x, y) => x.lastIndexOf(y) === x.length - y.length;

function isUI(id) {
   var relativePath = id.substring(src().length+1).replace(/\\/g, '/');
   switch (relativePath) {
      case 'Component':
      case 'ui/VDOM':
      case 'ui/Widget':
      case 'ui/PureContainer':
      case 'ui/CSS':
      case 'ui/CSSHelper':
      case 'ui/selection/Selection':
      case 'ui/layout/Layout':
      case 'ui/ResizeManager':
      case 'ui/FocusManager':
      case 'ui/Controller':
         //console.log(relativePath);
         return true;
   }
   return false;
}

var entries = [{
   name: 'util.js',
   options: {
      entry: [src('util/index.js')]
   },
   output: {}
}, {
   name: 'data.js',
   options: {
      entry: src('data/index.js')
   },
   output: {}
}, {
   name: 'ui.js',
   options: {
      entry: src('ui/index.js')
   },
   output: {}
}, {
   name: 'widgets.js',
   options: {
      entry: src('widgets/index.js')
   },
   external: isUI,
   output: {}
}, {
   name: 'charts.js',
   options: {
      entry: src('charts/index.js'),
   },
   external: isUI,
   output: {}
}];

entries.forEach(function(e) {
   // if (e.name != 'charts.js')
   //    return;

   var options = Object.assign({
      //treeshake: false,
      sourceMap:  true,
      external: function (id) {

         if (id.indexOf('babel') == 0)
            throw new Error('Babel stuff detected: ' + id);

         switch (id) {
            case 'route-parser':
            case 'cx-react':
            case 'intl-io':
               return true;

            default:
               return id[0] == '@'
         }
      },
      plugins: [
         multiEntry(),
         importAlias({
            external: e.external,
            paths: {
               [src('./util/')]: '@/util',
               [src('./app/')]: '@/ui',
               [src('./data/')]: '@/data',
               [src('./ui/svg/')]: '@/charts',
               [src('./')]: '@/ui',
            }
         }),
         babel(babelConfig)
      ]
   }, e.options);
   rollup.rollup(options)
      .then(function (bundle) {
         var result = bundle.generate(Object.assign({
            format: 'cjs'
         }, e.output));

         if (e.name) {
            //var code = result.code.replace(/from '@\//g, "from './");
            var code = result.code.replace(/require\('@\//g, "require('./");
            fs.writeFileSync(dist(e.name), code);
            console.log(e.name, code.length / 1000, 'kB');
         }
      })
      .catch(e => {
         console.log(e);
      });
});
