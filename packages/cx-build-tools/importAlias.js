var pathResolve = require('./pathResolve'),
   path = require('path'),
   fixPathSeparators = require('./fixPathSeparators');


module.exports = function(options = {}) {

   var regex = /import (.*) from ["'](.*)["']/g;
   var nsPath = options.path;

   //console.log('NS:', nsPath);

   return {
      transform(source, filePath) {
         if (!options.paths)
            return;
         return source.replace(regex, function (content, match1, match2) {
            if (match2[0] == '.') {
               filePath = fixPathSeparators(filePath);
               let importPath = pathResolve(path.dirname(filePath), match2);
               //console.log(filePath, match2, importPath, nsPath);
               if (importPath.indexOf(nsPath) == 0) {
                  for (let name in options.paths) {
                     //console.log(name);
                     if (filePath.indexOf(name) == 0)
                        return content; //do not change anything if we're in the same module

                     if (importPath.indexOf(name) == 0) {
                        //console.log(`import ${match1} from "${options.paths[name]}"`);
                        return `import ${match1} from "${options.paths[name]}"`;
                     }
                  }
                  console.log('UNMATCHED IMPORT INCLUDED IN THE BUNDLE', filePath, importPath, nsPath, match2, options.paths);
                  //throw new Error('Unmatched: ' + importPath);
               }
            }
            return content;
         });
      }
   };
};
