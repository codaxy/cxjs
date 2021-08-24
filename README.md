# CxJS

<img src="https://img.shields.io/npm/v/cx" alt="version" /> <img src="https://img.shields.io/npm/dm/cx" alt="downloads" />

CxJS, or simply Cx, is a feature-rich JavaScript framework for building complex web front-ends, such as BI tools,
dashboards and admin apps. Modern frameworks such as React and Angular provide an excellent base for building UI components,
however, component implementation and many other application aspects are left to the developer to figure out. CxJS tries to fill that gap and provide the all necessary ingredients required for modern web applications.

## Features

CxJS uses React (or a React compatible library like Preact) for DOM manipulation and offers many high-level, UI related, features on top of it.

### Widgets

- form elements ([DateTimeField](https://cxjs.io/docs/widgets/date-time-fields), [LookupField](https://cxjs.io/docs/widgets/lookup-fields), [ColorField](https://cxjs.io/docs/widgets/color-fields))
- advanced [grid control](https://cxjs.io/gallery/material/grid)
- navigation ([Menu](https://cxjs.io/gallery/material/menu/states), [Tab](https://cxjs.io/docs/widgets/tabs), [Link](https://cxjs.io/docs/widgets/links))
- overlays ([Window](https://cxjs.io/docs/widgets/windows), [MsgBox](https://cxjs.io/docs/widgets/msg-boxes), [Tooltip](https://cxjs.io/docs/widgets/tooltips), [Toast](https://cxjs.io/docs/widgets/toasts))

### Charts

- various chart types ([PieChart](https://cxjs.io/docs/charts/pie-charts), [LineGraph](https://cxjs.io/docs/charts/line-graphs), [ColumnGraph](https://cxjs.io/docs/charts/column-graphs), [BarGraph](https://cxjs.io/docs/charts/bar-graphs))
- axis types ([CategoryAxis](https://cxjs.io/docs/charts/category-axis), [NumericAxis](https://cxjs.io/docs/charts/numeric-axis), [TimeAxis](https://cxjs.io/docs/charts/time-axis))
- help elements ([Legend](https://cxjs.io/docs/charts/legend), [Marker](https://cxjs.io/docs/charts/markers), [Range](https://cxjs.io/docs/charts/ranges))

### State management

- [two-way data-binding](https://cxjs.io/docs/concepts/data-binding)
- [optional Redux integration](https://www.npmjs.com/package/cx-redux)
- [controllers](https://cxjs.io/docs/concepts/controllers)
- [computed values](https://cxjs.io/docs/concepts/controllers#computed-values)
- [triggers](https://cxjs.io/docs/concepts/controllers#triggers)
- [data views](https://cxjs.io/docs/concepts/data-views)

### Layout

- [inner (form) layouts](https://cxjs.io/docs/concepts/inner-layouts)
- [outer (page) layouts](https://cxjs.io/docs/concepts/outer-layouts)

### UI Concepts

- [form validation](https://cxjs.io/docs/widgets/validation-groups)
- [culture sensitive formatting and localization](https://cxjs.io/docs/concepts/localization)
- [client-side routing](https://cxjs.io/docs/concepts/router)
- [selection models](https://cxjs.io/docs/concepts/selections)

### Theming

- [SCSS variables and mixins](https://cxjs.io/docs/concepts/css)
- ready to use themes ([Material](https://cxjs.io/gallery/material), [Frost](https://cxjs.io/gallery/frost), [Dark](https://cxjs.io/gallery/dark))

## Learn CxJS

There are many examples and learning materials available:

- [Documentation](https://cxjs.io/docs)
- [Examples](https://cxjs.io/examples)
- [Gallery of Widgets & Themes ](https://cxjs.io/gallery)
- [Fiddle](https://cxjs.io/fiddle)

If you need help, ask a question on [StackOverflow](https://stackoverflow.com/questions/tagged/cxjs).
If you find a bug, please [raise an issue](https://github.com/codaxy/cxjs/issues).
[Request an invite to our Slack channel](https://cxjs.io/support)
and become a member of the CxJS community.

## Install & Start

This is a monolith repository used to develop main npm packages, documentation, widget gallery and fiddle. It uses yarn workspaces, so please use `yarn` to install packages and run the applications.

```bash
$ yarn install
```

Build CxJS:

```bash
yarn build
```

Run docs:

```bash
yarn start
```

Run gallery:

```bash
yarn gallery
```

## Starting a new project

CxJS is available as an NPM package - `cx`, which includes
compiled code, source code and TypeScript definitions.

Besides the `cx` package, you'll need other packages such as `cx-react` (or `cx-preact`) and `babel-plugin-transform-cx-jsx`.
You'll also need to configure Babel and webpack.

The quickest way to setup a new project is to use CLI:

```bash
md my-app
cd my-app
npm init -y
npm install cx-cli --global
cx scaffold
npm start
```

Alternatively, you can download the files from one of the CodeSandbox template projects:

- https://codesandbox.io/s/github/codaxy/cxjs-codesandbox-template

Once you create a new project, you may want to try our ready-to-use themes:

- [cx-theme-material](https://www.npmjs.com/package/cx-theme-material) ([Demo](https://cxjs.io/gallery/material))
- [cx-theme-frost](https://www.npmjs.com/package/cx-theme-frost) ([Demo](https://cxjs.io/gallery/frost))
- [cx-theme-dark](https://www.npmjs.com/package/cx-theme-dark) ([Demo](https://cxjs.io/gallery/dark))

Install a theme using `npm` or `yarn`.

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

Please read theme documentation to learn how to enable theme specific features.

### Boilerplates

Alternatively, start by forking one of the available boilerplate projects:

- [cx-starter-kit](https://github.com/codaxy/cx-starter-kit) - Full-blown admin and dashboard app
- [cx-redux-examples](https://github.com/codaxy/cx-redux-examples) - CxJS application with Redux based state management
- [cx-typescript-boilerplate](https://github.com/codaxy/cx-typescript-boilerplate) - CxJS with TypeScript

## Demo Applications

### Hacker News Progressive Web App

CxJS Hacker News is a Progressive Web App focused on startup performance.
The application is based on Preact and uses webpack plugins to enable preloading, inline CSS and JS,
configure service workers and achieve other performance gains.

<a href="https://hn.cxjs.io/">
    <img src="https://github.com/codaxy/cxjs/raw/master/misc/screenshots/hn/top.png" alt="Cx Hacker News PWA" />
</a>

[Open App](https://hn.cxjs.io/) | [Source Code](https://github.com/codaxy/cxjs-hackernews)

### Worldoscope

Worldoscope uses CxJS to visualize data available from the World Bank website.
Google Firebase is used to store report definitions, authentication and hosting.

<a href="https://worldoscope.cxjs.io/">
    <img src="https://github.com/codaxy/cxjs/raw/master/misc/screenshots/worldoscope/report.png" alt="Worldoscope Report" />
</a>

[Open App](https://worldoscope.cxjs.io/) | [Source Code](https://github.com/codaxy/worldoscope)

### Starter Kit

Cx Starter Kit is full blown admin and dashboard application template with many sample pages.

<a href="https://cxjs.io/starter">
    <img src="https://github.com/codaxy/cxjs/raw/master/misc/screenshots/starter/analytics.png" alt="Cx Starter Kit" />
</a>

[Open App](https://cxjs.io/starter) | [Source Code](https://github.com/codaxy/cx-starter-kit)

### State Of JS 2016 Explorer

A sample application that illustrates CxJS charting features by visualizing
data from [The State of JavaScript 2016](http://stateofjs.com/) survey.

<a href="https://codaxy.github.io/state-of-js-2016-explorer/">
    <img src="https://github.com/codaxy/cxjs/raw/master/misc/screenshots/sofjs2016/StateOfJs.png" alt="State of JS 2016 Explorer" />
</a>

[Open App](http://codaxy.github.io/state-of-js-2016-explorer) | [Source Code](https://github.com/codaxy/state-of-js-2016-explorer)

### tdo

CxJS based TODO app featuring a dark theme, keyboard navigation, markdown support, custom CSS and much more.

<a href="https://mstijak.github.io/tdo/">
    <img src="https://github.com/mstijak/tdo/raw/master/assets/screenshot.png" alt="tdo" />
</a>

[Open App](https://mstijak.github.io/tdo/) | [Source Code](https://github.com/mstijak/tdo)

## License

[MIT License](./LICENSE.md)
