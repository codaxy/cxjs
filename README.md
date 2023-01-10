<br />

<p align="center">
  <a href="https://cxjs.io">
    <img src="misc/logo/cx.svg" alt="cxjs logo" height="140">
  </a>
</p>

<p align="center">
    <img src="https://img.shields.io/npm/v/cx" alt="version" /> 
    <img src="https://img.shields.io/npm/dm/cx" alt="downloads" />
</p>

<br />

CxJS, or simply Cx, is a feature-rich JavaScript framework for building complex web front-ends, such as BI tools,
dashboards and admin apps.

## Learn CxJS

Explore CxJS by checking out available online resources:

-  [Documentation](https://cxjs.io/docs)
-  [Gallery of Widgets & Themes ](https://cxjs.io/gallery)
-  [Fiddle](https://cxjs.io/fiddle)
-  [Demo Apps](https://cxjs.io/demos)
-  [Examples](https://cxjs.io/examples)

If you need help, ask a question on [StackOverflow](https://stackoverflow.com/questions/tagged/cxjs).
If you find a bug, please [raise an issue](https://github.com/codaxy/cxjs/issues).
[Request an invite to our Slack channel](https://cxjs.io/support)
and become a member of the CxJS community.

## Starting a new project

CxJS is available as an NPM package - `cx`, which includes
compiled code, source code and TypeScript definitions.

Besides the `cx` package, you'll need other packages such as `cx-react` (or `cx-preact`) and `babel-preset-cx-env`.

You'll also need to configure Babel and webpack.

The quickest way to setup everything up is to use CLI:

```bash
npm install cx-cli --global
cx create my-app
cd my-app
npm start
```

Or if you prefer Yarn:

```bash
yarn create cx-app my-app
cd my-app
yarn start
```

Alternatively, you can download the files from one of the project templates:

-  https://github.com/codaxy/cxjs-tailwindcss-template
-  https://github.com/codaxy/cx-starter-kit
-  https://codesandbox.io/s/github/codaxy/cxjs-codesandbox-template

### Themes

Once you create a new project, you may want to try our ready-to-use visual themes:

-  [cx-theme-material](https://www.npmjs.com/package/cx-theme-material) ([Demo](https://cxjs.io/gallery/material))
-  [cx-theme-frost](https://www.npmjs.com/package/cx-theme-frost) ([Demo](https://cxjs.io/gallery/frost))
-  [cx-theme-dark](https://www.npmjs.com/package/cx-theme-dark) ([Demo](https://cxjs.io/gallery/dark))

Install the theme using `npm` or `yarn`.

```bash
npm install cx-theme-frost
```

Open `my-app/app/index.scss` and replace

```
@import "~cx/src/variables";
@import "~cx/src/index";
```

with

```
@import "~theme-package-name/src/variables";
@import "~theme-package-name/src/index";
```

Please read theme NPM package documentation to learn how to enable theme specific features.

## Features

CxJS uses React for DOM manipulation and offers many high-level features on top of it.

### Widgets

-  form elements ([DateTimeField](https://cxjs.io/docs/widgets/date-time-fields), [LookupField](https://cxjs.io/docs/widgets/lookup-fields), [ColorField](https://cxjs.io/docs/widgets/color-fields))
-  advanced [Grid (data table)](https://cxjs.io/gallery/material/grid) control
-  navigation elements ([Menu](https://cxjs.io/gallery/material/menu/states), [Tab](https://cxjs.io/docs/widgets/tabs), [Link](https://cxjs.io/docs/widgets/links))
-  overlays ([Window](https://cxjs.io/docs/widgets/windows), [MsgBox](https://cxjs.io/docs/widgets/msg-boxes), [Tooltip](https://cxjs.io/docs/widgets/tooltips), [Toast](https://cxjs.io/docs/widgets/toasts))

### Charts

-  various chart types ([PieChart](https://cxjs.io/docs/charts/pie-charts), [LineGraph](https://cxjs.io/docs/charts/line-graphs), [ColumnGraph](https://cxjs.io/docs/charts/column-graphs), [BarGraph](https://cxjs.io/docs/charts/bar-graphs))
-  axis types ([CategoryAxis](https://cxjs.io/docs/charts/category-axis), [NumericAxis](https://cxjs.io/docs/charts/numeric-axis), [TimeAxis](https://cxjs.io/docs/charts/time-axis))
-  help elements ([Legend](https://cxjs.io/docs/charts/legend), [Marker](https://cxjs.io/docs/charts/markers), [Range](https://cxjs.io/docs/charts/ranges))

### UI Concepts

-  [form validation](https://cxjs.io/docs/widgets/validation-groups)
-  [culture sensitive formatting and localization](https://cxjs.io/docs/concepts/localization)
-  [client-side routing](https://cxjs.io/docs/concepts/router)
-  [selection models](https://cxjs.io/docs/concepts/selections)

### State Management

-  [two-way data-binding](https://cxjs.io/docs/concepts/data-binding)
-  [controllers](https://cxjs.io/docs/concepts/controllers)
-  [computed values](https://cxjs.io/docs/concepts/controllers#computed-values)
-  [triggers](https://cxjs.io/docs/concepts/controllers#triggers)
-  [data views](https://cxjs.io/docs/concepts/data-views)

### Layout

-  [inner (form) layouts](https://cxjs.io/docs/concepts/inner-layouts)
-  [outer (page) layouts](https://cxjs.io/docs/concepts/outer-layouts)

### Theming

-  [SCSS variables and mixins](https://cxjs.io/docs/concepts/css)
-  ready to use themes ([Material](https://cxjs.io/gallery/material), [Frost](https://cxjs.io/gallery/frost), [Dark](https://cxjs.io/gallery/dark))

## Development

This is a monolith repository used to develop main npm packages, documentation, widget gallery and fiddle. It uses yarn workspaces, so please use `yarn` to install packages and run the applications.

```bash
yarn install
```

Build CxJS:

```bash
yarn build
```

Run tests:

```bash
yarn test
```

Run Docs:

```bash
yarn start
```

Run Gallery:

```bash
yarn gallery
```

Run Fiddle:

```bash
yarn fiddle
```

## License

CxJS is available under [the MIT License](./LICENSE.md).
