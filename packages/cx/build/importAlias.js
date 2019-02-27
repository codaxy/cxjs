var pathResolve = require('./pathResolve'),
   path = require('path');


module.exports = function(options = {}) {

   var regex = /import (.*) from ["'](.*)["']/g;
   var nsPath = options.path;

   //console.log('NS:', nsPath);

   return {
      transform(source, filePath) {
         return source.replace(regex, function (content, match1, match2) {
            if (match2[0] == '.') {
               var importPath = pathResolve(path.dirname(filePath), match2);
               if (importPath.indexOf(nsPath) != 0) {
                  for (var name in options.paths) {
                     if (importPath.indexOf(name) == 0)
                        return `import ${match1} from "${options.paths[name]}"`;
                  }
                  console.log('UNMATCHED IMPORT INCLUDED IN THE BUNDLE', importPath, nsPath, match2);
                  //throw new Error('Unmatched: ' + importPath);
               }
            }
            return content;
         });
      }
   };
};
