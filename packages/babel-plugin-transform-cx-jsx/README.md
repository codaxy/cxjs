# babel-plugin-transform-cx-jsx

This is a Babel plugin that transforms JSX code wrapped inside `<cx>` tags into plain JavaScript.

Example:
```jsx
const page = <cx>
    <div>
        <h1>Cx</h1>
        <p>Some text</p>
    </div>
</cx>    
```
becomes
```js
const page = {
    type: HtmlElement,
    tag: 'div',
    children: [{
        type: HtmlElement,
        tag: 'h1',
        children: ['Cx']
    }, {
       type: HtmlElement,
       tag: 'p',
       children: ['Some text']
   }]
}
```

Plugin options:

- `autoImportHtmlElement: true` - add HtmlElement import to your file, if missing
- `transformFunctionalComponents: true` - transform functional components

### Functional components

Functional components in CxJS require using `createFunctionalComponent`.
  
```jsx
const MySuperTextField = createFunctionalComponent(({label, value}) => <cx>
   <TextField value={value} label={label} mod="super" validation-mode="inline">
</cx>);
```

This plugin can detect Cx functional components and automatically wrap them
inside a `createFunctionalComponent` function call.

```jsx
const MySuperTextField = ({label, value}) => <cx>
   <TextField value={value} label={label} mod="super" validation-mode="inline">
</cx>;
```

Please note that this works only for arrow functions which immediately return the `<cx>`
element.
