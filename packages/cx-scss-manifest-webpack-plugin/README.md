# cx-scss-manifest-webpack-plugin

A webpack plugin that analyzes your application's source code and generates an SCSS manifest file
to include only the CxJS widget styles that are actually used. For smaller apps, this can reduce
the generated CSS by 70-90%.

## How It Works

CxJS ships SCSS for every widget (Button, Grid, Window, etc.). By default, all widget styles are
included during SCSS compilation. This plugin inspects webpack's module graph to determine which
CxJS modules your app actually imports, then generates a manifest that tells the SCSS compiler
to include only the styles for those modules.

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
npm install cx-scss-manifest-webpack-plugin --save-dev
```

## Usage

Add the plugin to your `webpack.config.js`:

```js
const CxScssManifestPlugin = require("cx-scss-manifest-webpack-plugin");
const path = require("path");

module.exports = {
   plugins: [
      new CxScssManifestPlugin({
         outputPath: path.join(__dirname, "manifest.scss"),
      }),
   ],
};
```

Then import the manifest **before** the CxJS SCSS in your main stylesheet:

```scss
@use "manifest";
@use "cx/src/index";
```

The import order matters. The manifest must be loaded first so it configures the SCSS
module system before any widget styles are compiled.

### With a Theme

When using a classic SCSS theme, import the manifest before the theme:

```scss
@use "manifest";
@use "cx-theme-aquamarine/src/index";
```

The theme internally loads `cx/src/index`, so you don't need to import it separately.

## Important

The generated `manifest.scss` must be checked into version control. The plugin updates
the manifest during compilation, but SCSS is compiled in the same pass — so the manifest
from the _previous_ build is what actually takes effect. When you add new CxJS widgets,
the updated manifest will take effect on the next build or hot-reload cycle.
