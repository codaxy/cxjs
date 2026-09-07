let fs = require("fs");
let { init, parse } = require("es-module-lexer");
let MagicString = require("magic-string");

const pluginName = "transform-cx-imports";

// matches namespace barrel imports: "cx/widgets", "cx/ui", "cx/charts", ...
const barrelRe = /^cx\/(\w+)$/;

// cheap pre-check so the lexer only runs for modules that actually import a barrel
const hasBarrelImportRe = /["']cx\/\w+["']/;

const scannedFileRe = /\.(jsx?|tsx?|mjs|mts)$/;

function loadCxManifest(root) {
   let manifestPath;
   try {
      manifestPath = require.resolve("cx/manifest.js", { paths: [root, __dirname] });
   } catch (e) {
      throw new Error(
         "vite-plugin-transform-cx-imports: Unable to resolve cx/manifest.js. Make sure the cx package is installed.",
      );
   }
   return require(manifestPath);
}

function aliasMatches(find, source) {
   if (find instanceof RegExp) return find.test(source);
   return source === find || source.indexOf(find + "/") === 0;
}

// Vite pre-bundles cx in dev when it is a regular dependency living in node_modules and is
// neither excluded from optimization nor aliased somewhere else (e.g. to a source checkout).
function isCxPreBundled(config) {
   let exclude = config.optimizeDeps && config.optimizeDeps.exclude;
   if (exclude && exclude.indexOf("cx") !== -1) return false;
   let alias = (config.resolve && config.resolve.alias) || [];
   for (let a of alias) if (aliasMatches(a.find, "cx/widgets")) return false;
   try {
      let pkg = require.resolve("cx/package.json", { paths: [config.root] });
      if (!config.resolve.preserveSymlinks) pkg = fs.realpathSync(pkg);
      return pkg.indexOf("node_modules") !== -1;
   } catch (e) {
      return false;
   }
}

module.exports = function transformCxImports(options = {}) {
   let { dev = "auto" } = options;

   let cxManifest = null;
   let nameLookup = null; // export name -> [manifest keys]
   let logger = console;
   let enabled = true;
   let warned = {};
   let parseWarned = new Set();

   function findEntry(ns, name) {
      let entry = cxManifest[ns + "/" + name];
      if (entry) return entry;
      // the export may live in another namespace, e.g. ui widgets re-exported through cx/widgets
      let candidates = nameLookup[name];
      if (candidates && candidates.length === 1) return cxManifest[candidates[0]];
      return null;
   }

   return {
      name: pluginName,

      configResolved(config) {
         logger = config.logger;
         cxManifest = loadCxManifest(config.root);
         nameLookup = {};
         for (let key in cxManifest) {
            let name = key.substring(key.indexOf("/") + 1);
            if (!nameLookup[name]) nameLookup[name] = [];
            nameLookup[name].push(key);
         }

         // In dev, the dependency scanner never sees the rewritten imports. If cx gets
         // pre-bundled, the scanner bundles the barrels while the served code would import
         // deep paths that were never optimized, which causes re-optimization reloads and
         // duplicated module instances. Pre-bundled cx is one flat chunk anyway, so the rewrite
         // has nothing to gain there - stay out of the way unless told otherwise.
         if (config.command === "serve") {
            enabled = dev === "auto" ? !isCxPreBundled(config) : !!dev;
            if (!enabled) logger.info(`[${pluginName}] cx is pre-bundled in dev, barrel imports are left as they are`);
         }
      },

      // This hook sees post-transform JavaScript: the core esbuild/oxc plugin runs before user
      // plugins, so TypeScript syntax and type-only imports are already gone.
      async transform(code, id) {
         if (!enabled) return null;
         //rewrite only the app's own modules
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

         let s = null;

         for (let imp of imports) {
            if (!imp.n || imp.d !== -1) continue; //skip dynamic imports
            let m = barrelRe.exec(imp.n);
            if (!m) continue;
            let ns = m[1];

            let stmt = code.substring(imp.ss, imp.se);
            //rewrite only pure named imports, i.e. import { A, B as C } from "cx/widgets"
            if (!/^import\s*\{/.test(stmt)) continue;
            let braceEnd = stmt.indexOf("}");
            if (braceEnd === -1) continue;

            let rewritten = [];
            let kept = [];
            let specifiers = stmt.substring(stmt.indexOf("{") + 1, braceEnd).split(",");
            for (let spec of specifiers) {
               spec = spec.trim();
               if (!spec) continue;
               let parts = spec.split(/\s+as\s+/);
               let imported = parts[0].trim();
               let local = parts[1] ? parts[1].trim() : imported;
               let entry = /^\w+$/.test(imported) ? findEntry(ns, imported) : null;
               if (!entry || !entry.js) {
                  kept.push(spec);
                  let key = ns + "/" + imported;
                  if (/^\w+$/.test(imported) && !warned[key]) {
                     warned[key] = true;
                     logger.warn(`[${pluginName}] ${key} not found in the cx manifest, keeping the barrel import`);
                  }
                  continue;
               }
               rewritten.push(
                  `import { ${imported === local ? imported : imported + " as " + local} } from "cx/${entry.js}";`,
               );
            }

            if (!rewritten.length) continue;
            if (kept.length) rewritten.unshift(`import { ${kept.join(", ")} } from "${imp.n}";`);
            if (!s) s = new MagicString(code);
            // the statement end reported by the lexer excludes the trailing semicolon - swallow it too
            let end = code[imp.se] === ";" ? imp.se + 1 : imp.se;
            s.overwrite(imp.ss, end, rewritten.join("\n"));
         }

         if (!s) return null;
         return { code: s.toString(), map: s.generateMap({ hires: "boundary" }) };
      },
   };
};
