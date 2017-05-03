let cxManifest = require('cx/manifest.js'),
   fs = require('fs');

let cxModuleNameMap = {};

for (let name in cxManifest) {
   if (cxManifest[name].scss)
      cxModuleNameMap[cxManifest[name].js] = name;
}

function CxScssManifestPlugin(options) {
   this.opts = Object.assign({}, options);
   this.manifest = {};
}

let ns1 = /cx\/src\/(\w*)\//;
let ns2 = /cx\/(\w*)/;

CxScssManifestPlugin.prototype.apply = function (compiler) {
   let manifest = this.manifest;
   let dirty = true;

   compiler.plugin('after-emit', (compilation, callback) => {
      compilation.chunks.forEach(chunk => {
         chunk.modules.forEach(module => {

            if (!module.resource || module.resource.indexOf('node_modules') != -1)
               return;

            module.dependencies.forEach(dep => {
               if (!dep.module || !dep.module.rawRequest || !dep.module.rawRequest.match(/^cx\//))
                  return;

               //console.log(module.resource, dep.module.usedExports);

               dep.module.usedExports.forEach(exp => {
                  let ns = dep.module.rawRequest.match(ns1) || dep.module.rawRequest.match(ns2);
                  if (!ns)
                     return;
                  let cxModule = ns[1] + '/' + exp;
                  //console.log(cxModule);
                  if (!manifest[cxModule] && cxManifest[cxModule] && cxManifest[cxModule].scss) {
                     //console.log(cxModule);
                     dirty = true;
                     manifest[cxModule] = true;
                  }
               });
            });
         })
      });

      let content = "//THIS FILE IS AUTO-GENERATED USING cx-scss-manifest-webpack-plugin\n\n";
      content += "$cx-include-all: false;\n\n";

      content += "@include cx-widgets(\n";
      content += Object.keys(manifest).map(k => '\t"cx/' + k + '"').join(',\n');
      content += "\n);\n";

      if (dirty) {
         fs.writeFileSync(this.opts.outputPath, content);
         dirty = false;
      }

      callback();
   });
};

module.exports = CxScssManifestPlugin;