// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import pagefind from "astro-pagefind";
import cxjs from "./src/integrations/cxjs";

// https://astro.build/config
export default defineConfig({
  integrations: [cxjs(), react(), mdx(), pagefind()],
  build: {
    format: "directory",
  },
  prefetch: {
    defaultStrategy: "hover",
  },
  experimental: {
    clientPrerender: true,
  },
  markdown: {
    shikiConfig: {
      theme: "github-dark-dimmed",
    },
  },
  vite: {
    plugins: [tailwindcss()],
    esbuild: {
      loader: "tsx",
      jsx: "automatic",
      jsxImportSource: "cx",
    },
    optimizeDeps: {
      include: ["route-parser", "cx-react"],
      exclude: ["cx"],
    },
    ssr: {
      external: ["route-parser"],
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler",
          silenceDeprecations: [
            "legacy-js-api",
            "import",
            "global-builtin",
            "slash-div",
          ],
        },
      },
    },
    build: {
      rollupOptions: {
        output: { manualChunks: undefined },
      },
    },
  },
});
