var sass = require("node-sass"),
   path = require("path");

function getImport(path) {
   return `@import "${path}";`;
}

module.exports = function renderSCSS(paths) {
   return new Promise((resolve, reject) => {
      let data = paths.map(getImport).join("\n");
      sass.render(
         {
            data,
            importer: function(name, prev, done) {
               if (name.indexOf("~cx/") == 0) {
                  let resolvedFile = path.resolve(
                     __dirname,
                     "../cx/" + name.substring(4) + ".scss"
                  );
                  return {
                     file: resolvedFile
                  };
               }
               return { file: name };
            }
         },
         function(err, result) {
            if (err) reject(err);
            else resolve(result);
         }
      );
   });
};
