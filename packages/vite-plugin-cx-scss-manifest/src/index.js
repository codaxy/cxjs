let fs = require("fs");
let { init, parse } = require("es-module-lexer");

const pluginName = "cx-scss-manifest";

// named imports from a namespace barrel: "cx/widgets", "cx/ui", "cx/charts", ...
const barrelRe = /^cx\/(\w+)$/;

// cheap pre-check so the lexer only runs for modules that actually import a barrel
const hasBarrelImportRe = /["']cx\/\w+["']/;

// deep imports, either as written ("cx/widgets/grid/Grid.js") or as already rewritten by an
// alias (".../cx/src/widgets/grid/Grid", "node_modules/cx/build/widgets/grid/Grid.js")
const deepImportRe = /(?:^cx|[\\/]cx[\\/](?:src|build))[\\/](\w+)[\\/]([\w\\/.-]+?)(?:\.[jt]sx?)?$/;

const scannedFileRe = /\.(jsx?|tsx?|mjs|mts)$/;

function loadCxManifest(root) {
   let manifestPath;
   try {
      manifestPath = require.resolve("cx/manifest.js", { paths: [root, __dirname] });
   } catch (e) {
      throw new Error(
         "vite-plugin-cx-scss-manifest: Unable to resolve cx/manifest.js. Make sure the cx package is installed.",
      );
   }
   return require(manifestPath);
}

module.exports = function cxScssManifestPlugin(options = {}) {
   let { outputPath } = options;
   if (!outputPath) throw new Error("vite-plugin-cx-scss-manifest: The outputPath option is required.");

   let cxManifest = null;
   let nameLookup = null; // export name -> [manifest keys]
   let jsPathLookup = null; // module path without extension ("widgets/grid/Grid") -> [manifest keys]
   let manifest = {};
   let dirty = false;
   let isBuild = false;
   let logger = console;
   let writeTimer = null;
   let parseWarned = new Set();

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
      if (!dirty || isBuild) return;
      if (writeTimer) clearTimeout(writeTimer);
      writeTimer = setTimeout(() => {
         writeTimer = null;
         try {
            write();
         } catch (e) {
            logger.error(`[${pluginName}] Failed to write ${outputPath}: ${e.message}`);
         }
      }, 100);
   }

   function recordResolvedImport(source, importer) {
      if (!importer || importer.indexOf("node_modules") !== -1) return;
      let m = deepImportRe.exec(source);
      if (!m) return;
      // one file usually backs several manifest keys (Select.js -> widgets/Select, widgets/Option);
      // importing the file pulls in all of them, and so should their styles
      let keys = jsPathLookup[m[1] + "/" + m[2]];
      if (!keys) return;
      for (let key of keys) record(key);
      scheduleWrite();
   }

   return [
      {
         // Every deep import passes through resolveId with its importer, in dev and in build, so
         // deep imports (including the ones produced by vite-plugin-transform-cx-imports) are
         // collected without parsing any source code. resolveId is a first-wins hook and Vite's
         // own resolver runs before normal plugins, so this part has to be enforced "pre".
         name: pluginName + ":resolve",
         enforce: "pre",
         resolveId(source, importer) {
            recordResolvedImport(source, importer);
            return null;
         },
      },
      {
         name: pluginName,

         configResolved(config) {
            isBuild = config.command === "build";
            logger = config.logger;
            cxManifest = loadCxManifest(config.root);
            nameLookup = {};
            jsPathLookup = {};
            for (let key in cxManifest) {
               let name = key.substring(key.indexOf("/") + 1);
               if (!nameLookup[name]) nameLookup[name] = [];
               nameLookup[name].push(key);
               let js = cxManifest[key].js;
               if (js) {
                  let jsPath = js.replace(/\.[jt]sx?$/, "");
                  if (!jsPathLookup[jsPath]) jsPathLookup[jsPath] = [];
                  jsPathLookup[jsPath].push(key);
               }
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

         // Named imports from a barrel ("import { Grid } from 'cx/widgets'") can't be attributed to a
         // module in resolveId, so those still need a look at the import statements. Note that this
         // hook sees post-transform JavaScript: Vite's core esbuild/oxc plugin runs before user
         // plugins, so TypeScript syntax and type-only imports are already gone.
         async transform(code, id) {
            //scan only the app's own modules
            if (id.indexOf("node_modules") !== -1) return null;
            let file = id.split("?")[0];
            if (!scannedFileRe.test(file)) return null;
            if (!hasBarrelImportRe.test(code)) return null;

            await init;
            let imports;
            try {
               [imports] = parse(code, id);
            } catch (e) {
               if (!parseWarned.has(file)) {
                  parseWarned.add(file);
                  logger.warn(`[${pluginName}] Unable to parse imports of ${file}: ${e.message}`);
               }
               return null;
            }

            for (let imp of imports) {
               if (!imp.n) continue;
               let m = barrelRe.exec(imp.n);
               if (!m) continue;
               let ns = m[1];

               //named imports, e.g. import { Button, Grid as CxGrid } from "cx/widgets"
               let stmt = code.substring(imp.ss, imp.se);
               let braceStart = stmt.indexOf("{");
               if (braceStart === -1 || braceStart > stmt.indexOf(imp.n)) continue;
               let braceEnd = stmt.indexOf("}", braceStart);
               if (braceEnd === -1) continue;
               let specifiers = stmt.substring(braceStart + 1, braceEnd).split(",");
               for (let spec of specifiers) {
                  let name = spec.trim().split(/\s+/)[0];
                  if (/^\w+$/.test(name)) recordName(ns, name);
               }
            }

            scheduleWrite();
            return null;
         },

         buildEnd() {
            if (writeTimer) {
               clearTimeout(writeTimer);
               writeTimer = null;
            }
            if (write() && isBuild) {
               this.warn(
                  "manifest.scss has been updated. CSS in this build was compiled using the previous manifest - run the build again to apply the changes.",
               );
            }
         },
      },
   ];
};
