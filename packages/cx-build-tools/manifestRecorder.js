var fs = require("fs"),
   pathResolve = require("./pathResolve"),
   fixPathSeparators = require("./fixPathSeparators"),
   p = require("path");

module.exports = function (manifest, paths, pkgSrc) {
   var imports = {};

   return function () {
      return {
         visitor: {
            ImportDeclaration: function (path, scope) {
               path.node.specifiers.forEach((spec) => {
                  var fileName = fixPathSeparators(scope.file.opts.filename);
                  var localImports = imports[fileName];
                  if (!localImports) localImports = imports[fileName] = {};
                  var resolvedPath = pathResolve(p.dirname(scope.file.opts.filename), path.node.source.value);
                  if (!/\.(ts|tsx)^/.test(resolvedPath)) resolvedPath += ".ts";
                  localImports[spec.local.name] = resolvedPath;
               });
            },

            ExportNamedDeclaration: function (path, scope) {
               let names = [];

               if (path.node.specifiers) {
                  path.node.specifiers.forEach((s) => {
                     names.push(s.exported.name);
                  });
               }

               if (path.node.declaration) {
                  if (path.node.declaration.id) names.push(path.node.declaration.id.name);

                  if (path.node.declaration.declarations) {
                     path.node.declaration.declarations.forEach((decl) => {
                        if (decl.id) {
                           names.push(decl.id.name);
                        }
                     });
                  }
               }

               names.forEach((name) => {
                  let path = fixPathSeparators(scope.file.opts.filename),
                     srcPath = path;

                  if (imports[path] && imports[path][name]) {
                     srcPath = imports[path][name];
                  }

                  for (var key in paths) {
                     if (path.indexOf(key) == 0) {
                        var jsPath = "src/" + srcPath.substring(pkgSrc.length + 1);

                        var expName = paths[key].substring(3) + "/" + name;

                        if (!manifest[expName]) manifest[expName] = {};

                        if (!manifest[expName].js) {
                           manifest[expName].js = jsPath;

                           if (fs.existsSync(srcPath.replace(/\.ts(x)?$/, ".scss")))
                              manifest[expName].scss = jsPath.replace(/\.ts(x)?$/, ".scss");
                        }

                        break;
                     }
                  }
               });
            },
         },
      };
   };
};
