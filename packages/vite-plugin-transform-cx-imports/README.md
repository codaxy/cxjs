# vite-plugin-transform-cx-imports

A Vite plugin that rewrites CxJS namespace imports into direct file imports, using the
manifest shipped with the `cx` package. This is the Vite counterpart of
[babel-plugin-transform-cx-imports](../babel-plugin-transform-cx-imports).

```js
// before
import { Button, Grid as CxGrid } from "cx/widgets";

// after
import { Button } from "cx/widgets/Button.js";
import { Grid as CxGrid } from "cx/widgets/grid/Grid.js";
```

## Why

- **Faster dev server:** importing `cx/widgets` pulls the entire namespace barrel (and
  everything it re-exports) through Vite's transform pipeline on cold start. Direct file
  imports load only the modules your app actually uses.
- **Deterministic tree shaking:** production bundles don't have to rely on the bundler
  proving the barrel re-exports side-effect free.

## Installation

```bash
npm install vite-plugin-transform-cx-imports --save-dev
```

## Usage

```js
import { defineConfig } from "vite";
import transformCxImports from "vite-plugin-transform-cx-imports";

export default defineConfig({
   plugins: [transformCxImports()],
});
```

### Options

- `dev` (default `"auto"`) — whether to rewrite imports in the dev server. Production builds
  are always rewritten. With `"auto"`, the rewrite is active in dev only when Vite does not
  pre-bundle cx: when cx is aliased, linked from outside `node_modules`, or listed in
  `optimizeDeps.exclude`. Pass `true` or `false` to force it either way.

### Dev server and dependency pre-bundling

When cx is a regular dependency in `node_modules`, Vite pre-bundles it into one flat chunk
in dev. There is nothing for the rewrite to speed up there, and it would actually hurt:
Vite's dependency scanner never runs config plugins, so it would pre-bundle the `cx/widgets`
barrels it finds in the source while the served code imports deep paths that were never
optimized, causing re-optimization reloads and duplicated module instances. That is why
`dev: "auto"` leaves such setups alone.

If you want the rewrite in dev anyway (e.g. to only load the widgets a page uses), exclude cx
from pre-bundling and pre-bundle its CommonJS dependencies explicitly, as Vite serves an
excluded package's own imports raw:

```js
optimizeDeps: {
   exclude: ["cx"],
   include: ["react", "react/jsx-runtime", "react-dom"],
},
```

The plugin detects the exclusion and switches the rewrite on.

## Behavior notes

- Only pure named imports from namespace barrels (`cx/widgets`, `cx/ui`, `cx/charts`, ...)
  are rewritten. Deep imports, namespace imports and dynamic imports are left untouched.
- Names that cannot be found in the cx manifest stay on the barrel import and produce a
  one-time warning.
- Exports re-exported across namespaces (e.g. a `cx/ui` widget imported from `cx/widgets`)
  are resolved through the manifest and rewritten to their actual source file.
- The plugin only parses modules that contain a barrel import, using
  [es-module-lexer](https://github.com/guybedford/es-module-lexer), which costs a few
  percent of the transform Vite already runs on every module.
- When combined with `vite-plugin-cx-scss-manifest`, register this plugin first. The
  manifest plugin collects deep imports through `resolveId` at no cost, so with the barrels
  already rewritten it never has to parse anything.
