# swc-plugin-transform-cx-imports

Having improved performance, this plugin **replaces** `babel-plugin-transform-cx-imports`.

### What is this plugin used for?

1. Rewrites Cx imports to use `src` files which may result in smaller builds:

`import { TextField } from 'cx/widgets'`

becomes

`import { TextField } from 'cx/src/form/TextField'`

2. Includes SCSS files for imported components (experimental):

`import { TextField } from 'cx/widgets'`

also adds

`import 'cx/src/form/TextField.scss'`

### Installation

1. Install the package using the `yarn add swc-plugin-transform-cx-imports` command. This plugin requires another plugin, which you can install using the `yarn add swc-plugin-transform-cx-jsx`.

2. Inside the `webpack.config.js` file, import manifest from `'cx/manifest'` - `const manifest = require('cx/manifest');`, and replace `babel-loader` with `swc-loader`:

```
{
  loader: 'swc-loader',
  options: {
    jsc: {
        loose: true,
        target: 'es2022',
        parser: {
          syntax: 'typescript',
          decorators: true,
          tsx: true,
        },
        experimental: {
          plugins: [
              [
                require.resolve('swc-plugin-transform-cx-jsx/swc_plugin_transform_cx_jsx_bg.wasm'),
                { trimWhitespace: true, autoImportHtmlElement: true },
              ],
              [
                require.resolve('swc-plugin-transform-cx-imports/swc_plugin_transform_cx_imports_bg.wasm'),
                { manifest, useSrc: true },
              ],
          ],
        },
        transform: {
          react: {
              pragma: 'VDOM.createElement',
          },
        },
    },
  },
}
```