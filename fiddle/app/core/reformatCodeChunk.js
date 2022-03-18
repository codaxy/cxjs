// import parse from "prettier/src/parser-babylon";
// import { printAstToDoc } from "prettier/src/printer";
// import { printDocToString } from "prettier/src/doc-printer";
// const prettier = require("prettier/standalone");
// const plugins = [require("prettier/esm/parser-babel.mjs")];

//using prettier standalone from web, as it doesn't work through npm
export function reformatCode(code) {
   if (typeof prettier =="undefined" || typeof prettierPlugins == "undefined")
      return code;

   let opts = {
      cursorOffset: -1,
      rangeStart: 0,
      rangeEnd: Infinity,
      useTabs: false,
      tabWidth: 2,
      printWidth: 80,
      singleQuote: false,
      trailingComma: "none",
      bracketSpacing: true,
      jsxBracketSameLine: false,
      parser: "babel",
      plugins: prettierPlugins,
      insertPragma: false,
      requirePragma: false,
      semi: true,
   };
   
   let result = prettier.format(code, opts);
   return result.replace(/{" "}/g, "");
}
