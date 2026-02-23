// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import pagefind from "astro-pagefind";
import cxjs from "./src/integrations/cxjs";
import llmsTxt from "./src/integrations/llms-txt";

// https://astro.build/config
export default defineConfig({
  site: "https://cxjs.io",
  integrations: [
    cxjs(),
    react(),
    mdx(),
    pagefind(),
    llmsTxt({
      title: "CxJS",
      description:
        "CxJS is a feature-rich JavaScript (TypeScript) framework for building complex web front-ends, such as portals, dashboards and admin applications.",
      site: "https://new.cxjs.io",
    }),
  ],
  trailingSlash: "never",
  build: {
    format: "file",
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
    ssr: {},
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
