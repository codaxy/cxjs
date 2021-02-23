# babel-plugin-transform-cx-jsx

This is a Babel plugin that transforms JSX code wrapped inside `<cx>` tags into plain JavaScript.

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

Plugin options:

-  `autoImportHtmlElement: true` - add HtmlElement import to your file, if missing
-  `transformFunctionalComponents: true` - transform functional components
-  `expandFatArrows: false` - transform fat arrows inside string based expressions (IE)
-  `trimWhitespace: false` - remove extra whitespace to trim application size
-  `trimWhitespaceExceptions: []` - specify the list of elements which should preserve the whitespace (e.g. ['Md', 'code'])

### Functional Components

Functional components in CxJS have to be wrapped inside a `createFunctionalComponent` call.
When `transformFunctionalComponents` is set to `true` the plugin will automatically add the call for
expressions which immediately return a `<cx>` block. i.e. `(props) => <cx></cx>`;

```jsx
const MySuperTextField = ({label, value}) => <cx>
   <TextField value={value} label={label} mod="super" validation-mode="inline">
</cx>;
```

becomes

```jsx
const MySuperTextField = createFunctionalComponent(({label, value}) => <cx>
   <TextField value={value} label={label} mod="super" validation-mode="inline">
</cx>);
```

### Trim Whitespace

Small gains in bundle size can be gained if `trimWhitespace` is set to `true`. This will remove the whitespace between elements, unless the parent element
has the `ws` or `preserveWhitespace` flag set. Some elements, such as code, should not be touched and this can be addressed using the `trimWhitespaceExceptions` configuration parameter.

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
      "    " //<- this line will be removed
      {
         type: HtmlElement,
         tag: "div",
      },
      "    " //<- this line will be removed
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
      "    " //<- this line will be preserved because of the ws parameter
      {
         type: HtmlElement,
         tag: "div",
      },
      "    " //<- this line will be preserved because of the ws parameter
   ],
};
```
