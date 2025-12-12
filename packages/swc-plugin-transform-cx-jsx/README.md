# swc-plugin-transform-cx-jsx

Having improved performance, this plugin **replaces** `babel-plugin-transform-cx-jsx`.

This is an SWC plugin that transforms JSX code wrapped inside `<cx>` tags into plain JavaScript.

Example:

```jsx
const page = (
   <cx>
      <div>
         <h1>Cx</h1>
         <p>Some text</p>
      </div>
   </cx>
);
```

becomes

```js
const page = {
   type: HtmlElement,
   tag: "div",
   children: [
      {
         type: HtmlElement,
         tag: "h1",
         children: ["Cx"],
      },
      {
         type: HtmlElement,
         tag: "p",
         children: ["Some text"],
      },
   ],
};
```

### Functional Components

Functional components in CxJS have to be wrapped inside a `createFunctionalComponent` call. When `transformFunctionalComponents` is set to `true` the plugin will automatically add the call for expressions which immediately return a `<cx>` block. i.e. `(props) => <cx></cx>;`

```jsx
const MySuperTextField = ({label, value}) => <cx>
   <TextField value={value} label={label} mod="super" validation-mode="inline" />
</cx>;
```

becomes

```jsx
const MySuperTextField = createFunctionalComponent(({label, value}) => <cx>
   <TextField value={value} label={label} mod="super" validation-mode="inline" />
</cx>);
```

### Trim Whitespace

Small gains in bundle size can be gained if `trimWhitespace` is set to `true`. This will remove the whitespace between elements, unless the parent element has the `ws` or `preserveWhitespace` flag set. Some elements, such as code, should not be touched and this can be addressed using the `trimWhitespaceExceptions` configuration parameter.

**Example 1**

```jsx
<cx>
   <div>
      <div />
   </div>
</cx>
```

```js
const page = {
   type: HtmlElement,
   tag: "div",
   children: [
      "    " //<- This line will be removed
      {
         type: HtmlElement,
         tag: "div",
      },
      "    " //<- This line will be removed
   ],
};
```

**Example 2**

```jsx
<cx>
   <div ws>
      <div />
   </div>
</cx>
```

```js
const page = {
   type: HtmlElement,
   tag: "div",
   ws: true,
   children: [
      "    " //<- This line will be preserved because of the ws parameter
      {
         type: HtmlElement,
         tag: "div",
      },
      "    " //<- This line will be preserved because of the ws parameter
   ],
};
```

### Installation

1. Install the package using the `yarn add swc-plugin-transform-cx-jsx` command.

2. Inside the `webpack.config.js` file, import manifest from `'cx/manifest'` - `const manifest = require('cx/manifest');`, and replace `babel-loader` with `swc-loader` (make sure to add it above other SWC plugins):

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

## 🐛 Debugging & Tracing

This plugin now includes comprehensive debugging capabilities. Enable detailed logging to understand and troubleshoot transformations:

```javascript
{
  loader: 'swc-loader',
  options: {
    jsc: {
      experimental: {
        plugins: [
          [
            require.resolve('swc-plugin-transform-cx-jsx/swc_plugin_transform_cx_jsx_bg.wasm'),
            {
              trimWhitespace: true,
              autoImportHtmlElement: true,
              debug: {
                enableTracing: true,        // Enable debug output
                logLevel: "debug",          // trace|debug|info|warn|error
                logTransformations: true,   // Log transformation steps
                logImports: true,           // Log import injection
                printAstBefore: false,      // Print AST before transform
                printAstAfter: false,       // Print AST after transform
              }
            }
          ]
        ]
      }
    }
  }
}
```

**Quick debugging:**
```bash
# Enable debug output
DEBUG_CX=true npm run build

# Set log level
DEBUG_CX=true DEBUG_CX_LEVEL=trace npm run build

# Use Rust log env
RUST_LOG=swc_plugin_transform_cx_jsx=debug npm run build
```

**📖 See [DEBUG.md](./DEBUG.md) for comprehensive debugging guide.**

## 🛠️ Development

### Quick Start

```bash
# Build the plugin
npm run build-plugin

# Run tests
npm run test-plugin

# Check code
npm run check
```

### Available Scripts

- `npm run build-plugin` - Build optimized WASM plugin
- `npm run build-plugin:debug` - Build with debug symbols
- `npm run test-plugin` - Run all tests
- `npm run check` - Quick compilation check
- `npm run clippy` - Run linter
- `npm run fmt` - Format code
- `npm run clean` - Clean build artifacts

**📖 See [DEVELOPMENT.md](./DEVELOPMENT.md) for complete development guide.**