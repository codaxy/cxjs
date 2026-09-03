import type { Plugin } from "vite";

declare namespace transformCxImports {
   interface Options {
      /** Also import the widget's SCSS file when the cx manifest lists one. Default: false. */
      scss?: boolean;
   }
}

declare function transformCxImports(options?: transformCxImports.Options): Plugin;

export = transformCxImports;
