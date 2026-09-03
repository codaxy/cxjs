# vite-plugin-cx-scss-manifest

A Vite plugin that analyzes your application's source code and generates an SCSS manifest file
to include only the CxJS widget styles that are actually used. For smaller apps, this can reduce
the generated CSS by 70-90%.

This is the Vite counterpart of [cx-scss-manifest-webpack-plugin](../cx-scss-manifest-webpack-plugin).

## How It Works

CxJS ships SCSS for every widget (Button, Grid, Window, etc.). By default, all widget styles are
included during SCSS compilation. This plugin scans the import statements of your application's
modules to determine which CxJS modules your app actually uses, then generates a manifest that
tells the SCSS compiler to include only the styles for those modules.

The generated `manifest.scss` looks like:

```scss
@use "cx/src/util/scss/include.scss" as * with ($cx-include-all: false);

@include cx-widgets(
   "cx/widgets/Button",
   "cx/widgets/Grid",
   "cx/widgets/HtmlElement"
);
```

## Installation

```bash
npm install vite-plugin-cx-scss-manifest --save-dev
```

## Usage

Add the plugin to your `vite.config.js`:

```js
import { defineConfig } from "vite";
import cxScssManifest from "vite-plugin-cx-scss-manifest";
import path from "path";

export default defineConfig({
   plugins: [
      cxScssManifest({
         outputPath: path.join(__dirname, "manifest.scss"),
      }),
   ],
});
```

Then import the manifest **before** the CxJS SCSS in your main stylesheet:

```scss
@use "manifest";
@use "cx/src/index";
```

The import order matters. The manifest must be loaded first so it configures the SCSS
module system before any widget styles are compiled.

### With a Theme

When using a SCSS theme, import the manifest before the theme:

```scss
@use "manifest";
@use "cx-theme-aquamarine/src/index";
```

The theme internally loads `cx/src/index`, so you don't need to import it separately.

## Important

The generated `manifest.scss` should be checked into version control for apps that use
`vite build` — SCSS is compiled in the same pass, so the manifest from the _previous_
build is what actually takes effect. Starting from an empty manifest would ship a build
with incomplete styles. For dev-only environments, gitignoring the file is fine; the
worst case is an unstyled first paint in a fresh clone until the manifest fills up.

- **Dev server:** modules are transformed on demand, so manifest entries are collected as
  pages are visited. Whenever a new CxJS widget is detected, the manifest is updated and
  Vite hot-reloads the stylesheet automatically.
- **Production build:** the full module graph is scanned, so all imports (including lazy
  routes) are detected. If the manifest changes during a build, the plugin emits a
  warning; run the build again to apply the changes.

Entries are only ever added, never removed — existing entries are re-read from the file
on startup, so a dev session that visits only a few pages never shrinks the manifest.
To reset it (e.g. after removing widgets from the app), delete the entries from
`manifest.scss` and run a production build.
