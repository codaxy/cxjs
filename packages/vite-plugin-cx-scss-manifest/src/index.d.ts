import type { Plugin } from "vite";

declare namespace cxScssManifestPlugin {
   interface Options {
      /** Path of the manifest.scss file to generate. */
      outputPath: string;
   }
}

declare function cxScssManifestPlugin(options: cxScssManifestPlugin.Options): Plugin;

export = cxScssManifestPlugin;
