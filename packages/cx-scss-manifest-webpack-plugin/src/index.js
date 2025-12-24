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

let ns1 = /cx[\\\/]build[\\\/](\w*)[\\\/]/;
let ns2 = /cx[\\\/]src[\\\/](\w*)[\\\/]/;
let ns3 = /cx[\\\/](\w*)[\\\/]/;

CxScssManifestPlugin.prototype.apply = function (compiler) {
   let manifest = this.manifest;
   let dirty = false;

   const write = () => {
      let content = "//THIS FILE IS AUTO-GENERATED USING cx-scss-manifest-webpack-plugin\n\n";
      content += "$cx-include-all: false;\n\n";

      let keys = Object.keys(manifest);
      keys.sort();

      content += "@include cx-widgets(\n";
      content += keys.map((k) => '\t"cx/' + k + '"').join(",\n");
      content += "\n);\n";

      let previousContent = fs.readFileSync(this.opts.outputPath, "utf8");
      if (content != previousContent) {
         console.log("CxJS SCSS manifest update.");
         fs.writeFileSync(this.opts.outputPath, content);
         return true;
      }
      return false;
   };

   compiler.hooks.compilation.tap(pluginName, (compilation) => {
      compilation.hooks.finishModules.tap(pluginName, (modules) => {
         for (const module of modules) {
            let moduleResource = getResource(module);
            if (!moduleResource || moduleResource.indexOf("node_modules") !== -1) continue;
            //console.log('M', moduleResource);
            for (let dependency of module.dependencies) {
               if (!dependency.name) continue;
               let depModule = compilation.moduleGraph.getModule(dependency);
               let resource = getResource(depModule);
               //console.log('  D', dependency.name, resource);
               if (!resource) continue;
               let ns = resource.match(ns1) || resource.match(ns2) || resource.match(ns3);
               if (!ns) continue;
               let cxModule = ns[1] + "/" + dependency.name;
               //console.log('  I', cxModule);
               if (!manifest[cxModule] && cxManifest[cxModule]) {
                  dirty = true;
                  manifest[cxModule] = true;
               }
            }
         }
         //console.log('MODULES');
      });

      compilation.hooks.needAdditionalPass.tap(pluginName, () => {
         //console.log('NEED-EXTRA PASS', dirty);
         if (write()) {
            //TODO: Figure out how to trigger a new SCSS round
         }
         return false;
      });
   });
};

function getResource(module) {
   if (!module) return null;
   return module.rootModule ? module.rootModule.resource : module.resource;
}

module.exports = CxScssManifestPlugin;
