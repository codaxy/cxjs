import { defineConfig } from "vite";
import { transform } from "esbuild";
import path from "path";
import { fileURLToPath } from "url";
import cxScssManifest from "vite-plugin-cx-scss-manifest";
import transformCxImports from "vite-plugin-transform-cx-imports";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// run against live CxJS sources instead of the compiled build output
const cxSrc = path.resolve(__dirname, "../packages/cx/src").replace(/\\/g, "/");

export default defineConfig(({ command }) => ({
   plugins: [
      cxScssManifest({
         outputPath: path.join(__dirname, "manifest.scss"),
      }),
      transformCxImports(),
      {
         // litmus examples use JSX inside .js files, which rolldown's built-in
         // transform doesn't support, so those files go through esbuild instead
         name: "litmus-js-jsx",
         enforce: "pre",
         async transform(code, id) {
            const file = id.split("?")[0];
            if (!file.endsWith(".js") || file.includes("node_modules")) return null;
            const result = await transform(code, {
               loader: "jsx",
               jsx: "automatic",
               jsxImportSource: "cx",
               jsxDev: command === "serve",
               sourcemap: true,
            });
            return { code: result.code, map: result.map };
         },
      },
   ],
   oxc: {
      jsx: {
         runtime: "automatic",
         importSource: "cx",
      },
   },
   resolve: {
      alias: [
         { find: /^cx\/src\/(.*)$/, replacement: `${cxSrc}/$1` },
         { find: /^cx\/(jsx-dev-runtime|jsx-runtime)$/, replacement: `${cxSrc}/$1.ts` },
         { find: /^cx\/([\w-]+)$/, replacement: `${cxSrc}/$1/index.ts` },
         // manifest js paths point to compiled .js files - strip the extension
         // so the resolver can pick up the .ts/.tsx sources
         { find: /^cx\/([\w-]+)\/(.*)\.js$/, replacement: `${cxSrc}/$1/$2` },
         { find: /^cx\/([\w-]+)\/(.*)$/, replacement: `${cxSrc}/$1/$2` },
      ],
   },
   css: {
      preprocessorOptions: {
         scss: {
            silenceDeprecations: ["legacy-js-api", "import", "global-builtin", "slash-div"],
         },
      },
   },
   server: {
      port: 8090,
      open: "/index.vite.html",
   },
   build: {
      outDir: "dist-vite",
      rollupOptions: {
         input: path.join(__dirname, "index.vite.html"),
      },
   },
}));
