// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import pagefind from "astro-pagefind";
import cxjs from "./src/integrations/cxjs";
import astroLlmsTxt from "@4hse/astro-llms-txt";

// https://astro.build/config
export default defineConfig({
  site: "https://cxjs.io",
  integrations: [
    cxjs(),
    react(),
    mdx(),
    pagefind(),
    astroLlmsTxt({
      title: "CxJS",
      description:
        "CxJS is a feature-rich JavaScript framework for building complex web front-ends, such as BI tools, dashboards and admin apps.",
      details:
        "CxJS offers declarative data binding, comprehensive widget library, advanced charting capabilities, and flexible theming system.",
      notes:
        "- This content is auto-generated from the official CxJS documentation.",
      docSet: [
        {
          title: "Complete Documentation",
          description: "Full CxJS documentation including all guides and API references",
          url: "/llms-full.txt",
          include: ["docs/", "docs/**"],
          promote: ["docs/intro/what-is-cxjs", "docs/intro/installation"],
        },
        {
          title: "Documentation Structure",
          description: "Index of key documentation pages and sections",
          url: "/llms-small.txt",
          include: ["docs/", "docs/**"],
          onlyStructure: true,
          promote: ["docs/intro/what-is-cxjs"],
        },
      ],
      pageSeparator: "\n\n---\n\n",
    }),
  ],
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
