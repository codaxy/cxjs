import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const src = (path: string) => fileURLToPath(new URL(`./src/${path}`, import.meta.url));

export default defineConfig({
   resolve: {
      alias: [
         // spec files use the CxJS JSX runtime (tsconfig "jsxImportSource": "cx")
         { find: /^cx\/jsx-runtime$/, replacement: src("jsx-runtime.ts") },
         { find: /^cx\/jsx-dev-runtime$/, replacement: src("jsx-dev-runtime.ts") },
      ],
   },
   oxc: {
      jsx: {
         runtime: "automatic",
         importSource: "cx",
      },
   },
   test: {
      include: ["src/**/*.spec.{ts,tsx}"],
      exclude: ["src/**/*.spec.helpers.*"],
   },
});
