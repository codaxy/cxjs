var fs = require('fs');

module.exports = function (manifest, paths, pkgSrc) {
   return function () {
      return {
         visitor: {
            ExportNamedDeclaration: function (path, scope) {
               if (path.node.declaration && path.node.declaration.id) {
                  for (var key in paths) {
                     if (scope.file.opts.filename.replace(/\\/g, '/').indexOf(key.replace(/\\/g, '/')) == 0) {
                        var p = 'src/' + scope.file.opts.filename.substring(pkgSrc.length + 1).replace(/\\/g, '/');
                        var name = paths[key].substring(2) + '/' + path.node.declaration.id.name;

                        if (!manifest[name])
                           manifest[name] = {};

                        if (!manifest[name].js) {
                           manifest[name].js = p;

                           if (fs.existsSync(scope.file.opts.filename.replace(/\.js$/, '.scss')))
                              manifest[name].scss = p.replace(/\.js$/, '.scss');
                        }

                        break;
                     }
                  }
               }
            }
         }
      }
   }
};
