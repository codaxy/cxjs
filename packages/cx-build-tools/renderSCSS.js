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
                  // Handle bare cx/ paths (used by @use/@forward)
                  if (url.startsWith("cx/")) {
                     const resolvedFile = path.resolve(__dirname, "../" + url + ".scss");
                     return new URL(`file://${resolvedFile.replace(/\\/g, "/")}`);
                  }
                  // Handle absolute paths (Unix-style starting with /)
                  if (url.startsWith("/")) {
                     return new URL(`file://${url}`);
                  }
                  // Handle Windows absolute paths (e.g., C:/...)
                  if (/^[a-zA-Z]:/.test(url)) {
                     return new URL(`file:///${url}`);
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
