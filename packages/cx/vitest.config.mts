import { fileURLToPath } from "node:url";
import { playwright } from "@vitest/browser-playwright";
import { configDefaults, defineConfig } from "vitest/config";

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
      projects: [
         {
            // logic tests: data, util, formatting, ...
            extends: true,
            test: {
               name: "node",
               include: ["src/**/*.spec.{ts,tsx}"],
               exclude: [...configDefaults.exclude, "src/**/*.browser.spec.*"],
            },
         },
         {
            // rendering tests: real DOM in Chromium
            extends: true,
            define: {
               // read by the `util` package, which the browser port of Node's `assert` depends on
               "process.env.NODE_DEBUG": "false",
            },
            test: {
               name: "browser",
               include: ["src/**/*.browser.spec.{ts,tsx}"],
               setupFiles: ["./vitest.setup.browser.ts"],
               browser: {
                  enabled: true,
                  headless: true,
                  provider: playwright(),
                  instances: [{ browser: "chromium" }],
                  // the default viewport is phone-sized (414 x 896)
                  viewport: { width: 1280, height: 800 },
               },
            },
         },
      ],
   },
});
