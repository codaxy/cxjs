var path = require('path');

let regex = /.*\\(.*)\.js$/;

module.exports = function(manifest, paths, pkg) {
   return {
      transform(source, filePath) {
         let match = regex.exec(filePath);
         if (match) {
            for (var key in paths) {
               if (filePath.indexOf(key) == 0) {
                  let path = filePath.substring(key.length + 1).replace(/\\/g, '/');
                  let entry = pkg + '/' + match[1];
                  if (!manifest[entry])
                     manifest[entry] = {};
                  manifest[entry].js = path;
               }
            }
         }
         return source;
      }
   }
};
