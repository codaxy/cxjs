var path = require('path');

module.exports = function(options = {}) {

   var regex = /import (.*) from ["'](.*)["']/g;

   return {
      transform(source, filePath) {
         return source.replace(regex, function (content, match1, match2) {
            var relativePath = path.resolve(path.dirname(filePath), match2);
            for (var name in options.paths) {
               if (relativePath.indexOf(name) == 0) {
                  var isExternal = filePath.indexOf(name) != 0 || (options.external && options.external(relativePath));
                  //console.log(relativePath, filePath, name, isExternal);
                  if (isExternal)
                     return `import ${match1} from "${options.paths[name]}"`;
               }
            }
            return content;
         });
      }
   };
};
