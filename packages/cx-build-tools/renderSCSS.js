const sass = require("sass");
const path = require("path");

function getImport(importPath) {
   return `@import "${importPath}";`;
}

module.exports = async function renderSCSS(paths) {
   try {
      const data = paths.map(getImport).join("\n");

      const result = await sass.compileStringAsync(data, {
         importers: [
            {
               findFileUrl(url) {
                  if (url.startsWith("~cx/")) {
                     const resolvedFile = path.resolve(__dirname, "../cx/" + url.substring(4) + ".scss");
                     return new URL(`file://${resolvedFile.replace(/\\/g, "/")}`);
                  }
                  return null;
               },
            },
         ],
         silenceDeprecations: ["import", "global-builtin"],
      });

      return result;
   } catch (err) {
      throw err;
   }
};
