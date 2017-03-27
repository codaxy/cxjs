var path = require('path');

module.exports = function(basePath, x) {
   return path.resolve(basePath, x).replace(/\\/g, '/');
};
