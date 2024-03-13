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