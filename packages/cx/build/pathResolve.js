var path = require('path');
var fixPathSeparators = require('./fixPathSeparators');

module.exports = function(basePath, x) {
   return fixPathSeparators(path.resolve(basePath, x));
};

