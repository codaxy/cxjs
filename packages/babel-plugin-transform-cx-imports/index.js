"use strict";

var manifest = require('cx-core/manifest.js');

// let manifest = {
//    'widgets/TextField': {
//       js: 'src/ui/form/TextField',
//       scss: 'src/ui/form/TextField.scss'
//    }
// };

module.exports = function(options) {
   var t = options.types;

   return {
      visitor: {
         ImportDeclaration(path, scope) {

            var opts = scope.opts;

            var src = path.node.source.value;

            if (src.indexOf("cx/") == 0) {
               var remainder = src.substring(3);

               var imports = [];

               path.node.specifiers.forEach(function (s) {
                  var expanded = remainder + '/' + s.imported.name;
                  var srcFile = manifest[expanded];
                  if (srcFile) {
                     if (srcFile.js)
                        imports.push(t.importDeclaration([s], t.stringLiteral('cx-core/' + srcFile.js)));
                     if (srcFile.scss && opts.scss)
                        imports.push(t.importDeclaration([], t.stringLiteral('cx-core/' + srcFile.scss)));
                  }
               });

               path.replaceWithMultiple(imports);
            }
         }
      }
   }
};
