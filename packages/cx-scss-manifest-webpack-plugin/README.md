# cx-scss-manifest-webpack-plugin

This package contains a webpack plugin that inspects application's source code and
generates a manifest file to include only a subset of [CxJS](https://cxjs.io/) SCSS content.

### Installation

```
npm install cx-scss-manifest-webpack-plugin --save-dev
```

### Usage

In `webpack.config.js`, import the plugin

```
const CxScssManifestPlugin = require('cx-scss-manifest-webpack-plugin');
```

and add it to the `plugins` list.

```
    plugins: [
        new CxScssManifestPlugin({
            outputPath: path.join(__dirname, 'app/manifest.scss')
        })
    ]
```

Finally, import the manifest in main `scss` file.

```
@import "~cx/src/variables";

@import "manifest";

@import "~cx/src/index";
```

For smaller apps, this will cause a greatly reduce the amount of generated CSS.
