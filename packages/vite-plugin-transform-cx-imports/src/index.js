let { init, parse } = require("es-module-lexer");
let MagicString = require("magic-string");

const pluginName = "transform-cx-imports";

// matches namespace barrel imports: "cx/widgets", "cx/ui", "cx/charts", ...
const barrelRe = /^cx\/(\w+)$/;

const scannedFileRe = /\.(jsx?|tsx?|mjs|mts)$/;

function loadCxManifest(root) {
   let manifestPath;
   try {
      manifestPath = require.resolve("cx/manifest.js", { paths: [root, __dirname] });
   } catch (e) {
      throw new Error(
         "vite-plugin-transform-cx-imports: Unable to resolve cx/manifest.js. Make sure the cx package is installed."
      );
   }
   return require(manifestPath);
}

module.exports = function transformCxImports(options = {}) {
   let { scss = false } = options;

   let cxManifest = null;
   let nameLookup = null; // export name -> [manifest keys]
   let logger = console;
   let warned = {};

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
      },

      async transform(code, id) {
         //rewrite only the app's own modules
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

         let s = null;

         for (let imp of imports) {
            if (!imp.n || imp.d !== -1) continue; //skip dynamic imports
            let m = barrelRe.exec(imp.n);
            if (!m) continue;
            let ns = m[1];

            let stmt = code.substring(imp.ss, imp.se);
            if (/^import\s+type\s/.test(stmt)) continue;
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
               if (spec.indexOf("type ") === 0) {
                  kept.push(spec);
                  continue;
               }
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
                  `import { ${imported === local ? imported : imported + " as " + local} } from "cx/${entry.js}";`
               );
               if (scss && entry.scss) rewritten.push(`import "cx/${entry.scss}";`);
            }

            if (!rewritten.length) continue;
            if (kept.length) rewritten.unshift(`import { ${kept.join(", ")} } from "${imp.n}";`);
            if (!s) s = new MagicString(code);
            s.overwrite(imp.ss, imp.se, rewritten.join("\n"));
         }

         if (!s) return null;
         return { code: s.toString(), map: s.generateMap({ hires: true }) };
      },
   };
};
