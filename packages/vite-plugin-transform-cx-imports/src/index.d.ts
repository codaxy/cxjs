import type { Plugin } from "vite";

declare namespace transformCxImports {
   interface Options {
      /**
       * Whether to rewrite imports in the dev server. Production builds are always rewritten.
       * "auto" (default) rewrites only when Vite does not pre-bundle cx, i.e. when cx is excluded
       * via optimizeDeps.exclude, aliased, or linked from outside node_modules.
       */
      dev?: "auto" | boolean;
   }
}

declare function transformCxImports(options?: transformCxImports.Options): Plugin;

export = transformCxImports;
