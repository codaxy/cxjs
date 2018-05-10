const pathResolve = require('./pathResolve');

module.exports = function getPathResolver(basePath) {
   return function (x) {
      if (!x)
         return basePath;
      return pathResolve(basePath, x);
   }
};