import parse from "prettier/src/parser-babylon";
import { printAstToDoc } from "prettier/src/printer";
import { printDocToString } from "prettier/src/doc-printer";

export function reformatCode(code) {
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
      parser: "babylon",
      insertPragma: false,
      requirePragma: false,
      semi: true,
      originalText: code
   };
   const ast = parse(code);
   const doc = printAstToDoc(ast, opts);
   const result = printDocToString(doc, opts);
   return result.formatted.replace(/{" "}/g, "");
}
