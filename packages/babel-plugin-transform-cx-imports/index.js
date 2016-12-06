"use strict";

var manifest = require('cx-core/manifest.js');

// let manifest = {
//    'widgets/TextField': {
//       js: 'src/ui/form/TextField',
//       scss: 'src/ui/form/TextField.scss'
//    }
// };

module.exports = function(options, o1) {
   var t = options.types;

   return {
      visitor: {
         ImportDeclaration(path, scope) {

            var opts = scope.opts;
            var src = path.node.source.value;
            var importScss = opts.sass || opts.scss;

            if (src.indexOf("cx/") == 0) {
               var remainder = src.substring(3);

               if (opts.useSrc) {
                  var imports = [];

                  path.node.specifiers.forEach(function (s) {
                     var expanded = remainder + '/' + s.imported.name;
                     var srcFile = manifest[expanded];
                     if (srcFile) {
                        if (srcFile.js)
                           imports.push(t.importDeclaration([s], t.stringLiteral('cx-core/' + srcFile.js)));

                        if (srcFile.scss && importScss) {
                           imports.push(t.importDeclaration([], t.stringLiteral('cx-core/' + srcFile.scss)));
                        }
                     }
                  });

                  path.replaceWithMultiple(imports);
               }
               else {
                  //cx-core => cx
                  path.replaceWith(t.importDeclaration(path.node.specifiers, t.stringLiteral("cx-core/" + remainder)));
               }
            }
         }
      }
   }
};
