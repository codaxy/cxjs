let fs = require("fs");
let { init, parse } = require("es-module-lexer");

const pluginName = "cx-scss-manifest";

// matches "cx/widgets", "cx/ui", "cx/charts/PieChart", "cx/widgets/grid/Grid.js", ...
const cxImportRe = /^cx\/(\w+)(?:\/(.+?))?(?:\.jsx?)?$/;

const scannedFileRe = /\.(jsx?|tsx?|mjs|mts)$/;

function loadCxManifest(root) {
   let manifestPath;
   try {
      manifestPath = require.resolve("cx/manifest.js", { paths: [root, __dirname] });
   } catch (e) {
      throw new Error(
         "vite-plugin-cx-scss-manifest: Unable to resolve cx/manifest.js. Make sure the cx package is installed."
      );
   }
   return require(manifestPath);
}

module.exports = function cxScssManifestPlugin(options = {}) {
   let { outputPath } = options;
   if (!outputPath) throw new Error("vite-plugin-cx-scss-manifest: The outputPath option is required.");

   let cxManifest = null;
   let nameLookup = null; // export name -> [manifest keys]
   let manifest = {};
   let dirty = false;
   let isBuild = false;
   let logger = console;
   let writeTimer = null;

   //touch output file immediately to avoid compilation errors
   if (!fs.existsSync(outputPath)) fs.writeFileSync(outputPath, "");

   function record(key) {
      if (cxManifest[key] && !manifest[key]) {
         manifest[key] = true;
         dirty = true;
      }
   }

   function recordName(ns, name) {
      let exact = ns + "/" + name;
      if (cxManifest[exact]) return record(exact);
      // the export may live in another namespace, e.g. ui widgets re-exported through cx/widgets
      let candidates = nameLookup[name];
      if (candidates) for (let key of candidates) record(key);
   }

   function write() {
      dirty = false;
      let content = "//THIS FILE IS AUTO-GENERATED USING vite-plugin-cx-scss-manifest\n\n";
      content += '@use "cx/src/util/scss/include.scss" as * with ($cx-include-all: false);\n\n';

      let keys = Object.keys(manifest);
      keys.sort();

      content += "@include cx-widgets(\n";
      content += keys.map((k) => '\t"cx/' + k + '"').join(",\n");
      content += "\n);\n";

      let previousContent = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, "utf8") : "";
      if (content == previousContent) return false;
      logger.info("CxJS SCSS manifest update.");
      fs.writeFileSync(outputPath, content);
      return true;
   }

   function scheduleWrite() {
      if (writeTimer) clearTimeout(writeTimer);
      writeTimer = setTimeout(write, 100);
   }

   return {
      name: pluginName,

      configResolved(config) {
         isBuild = config.command === "build";
         logger = config.logger;
         cxManifest = loadCxManifest(config.root);
         nameLookup = {};
         for (let key in cxManifest) {
            let name = key.substring(key.indexOf("/") + 1);
            if (!nameLookup[name]) nameLookup[name] = [];
            nameLookup[name].push(key);
         }

         //seed with entries from a previous run so the manifest only ever grows
         if (fs.existsSync(outputPath)) {
            let previousContent = fs.readFileSync(outputPath, "utf8");
            let entryRe = /"cx\/([^"]+)"/g,
               m;
            while ((m = entryRe.exec(previousContent))) {
               if (cxManifest[m[1]]) manifest[m[1]] = true;
            }
         }
      },

      async transform(code, id) {
         //scan only the app's own modules
         if (id.indexOf("node_modules") !== -1) return null;
         let file = id.split("?")[0];
         if (!scannedFileRe.test(file)) return null;
         if (code.indexOf("cx/") === -1) return null;

         await init;
         let imports;
         try {
            [imports] = parse(code, id);
         } catch (e) {
            return null;
         }

         for (let imp of imports) {
            if (!imp.n) continue;
            let m = cxImportRe.exec(imp.n);
            if (!m) continue;
            let ns = m[1];
            let deepPath = m[2];

            if (deepPath) {
               //deep import, e.g. "cx/widgets/grid/Grid" - record the module directly
               record(ns + "/" + deepPath);
               recordName(ns, deepPath.substring(deepPath.lastIndexOf("/") + 1));
            }

            //named imports, e.g. import { Button, Grid as CxGrid } from "cx/widgets"
            let stmt = code.substring(imp.ss, imp.se);
            if (/^import\s+type\s/.test(stmt)) continue;
            let braceStart = stmt.indexOf("{");
            if (braceStart === -1 || braceStart > stmt.indexOf(imp.n)) continue;
            let braceEnd = stmt.indexOf("}", braceStart);
            if (braceEnd === -1) continue;
            let specifiers = stmt.substring(braceStart + 1, braceEnd).split(",");
            for (let spec of specifiers) {
               spec = spec.trim();
               if (!spec || spec.indexOf("type ") === 0) continue;
               let name = spec.split(/\s+/)[0];
               if (/^\w+$/.test(name)) recordName(ns, name);
            }
         }

         if (dirty && !isBuild) scheduleWrite();
         return null;
      },

      buildEnd() {
         if (writeTimer) {
            clearTimeout(writeTimer);
            writeTimer = null;
         }
         if (write() && isBuild) {
            this.warn(
               "manifest.scss has been updated. CSS in this build was compiled using the previous manifest - run the build again to apply the changes."
            );
         }
      },
   };
};
