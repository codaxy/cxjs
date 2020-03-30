let cxManifest = require("cx/manifest.js"),
   fs = require("fs");

let cxModuleNameMap = {};

const pluginName = "CxScssManifestPlugin";

for (let name in cxManifest) {
   if (cxManifest[name].scss) cxModuleNameMap[cxManifest[name].js] = name;
}

function CxScssManifestPlugin(options) {
   this.opts = Object.assign({}, options);
   this.manifest = {};

   //touch output file immediately to avoid compilation errors
   if (!fs.existsSync(this.opts.outputPath)) {
      fs.writeFileSync(this.opts.outputPath, "");
   }
}

let ns1 = /cx[\\\/]src[\\\/](\w*)[\\\/]/;
let ns2 = /cx[\\\/](\w*)[\\\/]/;

CxScssManifestPlugin.prototype.apply = function(compiler) {
   let manifest = this.manifest;
   let dirty = false;

   compiler.hooks.compilation.tap(pluginName, compilation => {
      compilation.hooks.additionalAssets.tap(pluginName, () => {
         compilation.chunks.forEach(chunk => {
            for (const module of chunk.modulesIterable) {
               if (
                  !module.resource ||
                  module.resource.indexOf("node_modules") !== -1
               )
                  return;

               module.dependencies.forEach(dep => {
                  /*
                     It would be better to use usedExports but they are missing in webpack 4
                   */

                  if (
                     !dep.module ||
                     !dep.module.buildMeta ||
                     !dep.module.buildMeta.providedExports ||
                     !dep.module.resource
                  )
                     return;

                  let ns =
                     dep.module.resource.match(ns1) ||
                     dep.module.resource.match(ns2);
                  if (!ns) return;

                  dep.module.buildMeta.providedExports.forEach(exp => {
                     let cxModule = ns[1] + "/" + exp;
                     if (!manifest[cxModule] && cxManifest[cxModule]) {
                        dirty = true;
                        manifest[cxModule] = true;
                     }
                  });
               });
            }
         });
      });

      compilation.hooks.needAdditionalPass.tap(pluginName, () => {
         let content =
            "//THIS FILE IS AUTO-GENERATED USING cx-scss-manifest-webpack-plugin\n\n";
         content += "$cx-include-all: false;\n\n";

         let keys = Object.keys(manifest);
         keys.sort();

         content += "@include cx-widgets(\n";
         content += keys.map(k => '\t"cx/' + k + '"').join(",\n");
         content += "\n);\n";

         if (dirty) {
            let previousContent = fs.readFileSync(this.opts.outputPath, "utf8");
            if (content != previousContent) {
               console.log("CxJS SCSS manifest update.");
               fs.writeFileSync(this.opts.outputPath, content);
            }
            dirty = false;
         }

         return dirty;
      });
   });
};

module.exports = CxScssManifestPlugin;
