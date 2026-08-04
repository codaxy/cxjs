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

- `scss` (default `false`) — also emit an import for the widget's SCSS file when the cx
  manifest lists one, e.g. `import "cx/widgets/Button.scss"`. This is an alternative to
  generating a global SCSS manifest with
  [cx-scss-manifest-vite-plugin](../cx-scss-manifest-vite-plugin). Note that it only
  takes effect when the installed cx package's manifest contains SCSS entries.

## Behavior notes

- Only pure named imports from namespace barrels (`cx/widgets`, `cx/ui`, `cx/charts`, ...)
  are rewritten. Deep imports, namespace imports, dynamic imports, and `import type`
  statements are left untouched.
- Names that cannot be found in the cx manifest stay on the barrel import and produce a
  one-time warning.
- Exports re-exported across namespaces (e.g. a `cx/ui` widget imported from `cx/widgets`)
  are resolved through the manifest and rewritten to their actual source file.
- When combined with `cx-scss-manifest-vite-plugin`, register the manifest plugin first
  so it sees the original imports (it also understands the rewritten deep imports, so
  ordering is not critical).
