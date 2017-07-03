CxJS
============

CxJS, or simply Cx, is a feature-rich JavaScript framework for building complex web front-ends, such as BI tools, 
dashboards and admin apps. Modern frameworks such as React and Angular provide an excellent base for building UI components,
however, components and many other things are left to the developer. CxJS tries to fill that gap. 
CxJS uses React (or React compatible library) for DOM manipulation and 
offers many high-level UI related features on top of it, such as:

- widgets 
    - form elements (DateTimeField, LookupField, Switch)
    - advanced grid control
    - navigation (Menu, Tab, Link)
    - overlays (Window, MsgBox, Tooltip, Toast)
        
- charts
    - various chart types (pie-charts, line-graphs, columns, bars)
    - axis types (category, numeric, time)
    - help elements (legend, marker, range)

- state management
    - two-way data-binding
    - optional Redux integration
    - computable values
    - triggers    
    - controllers
    - data views (Repeater, Sandbox, Rescope)
    
- layout
    - inner (form) layouts
    - outer (page) layouts
    
- form validation

- user cultures

- client-side routing

- selection models
    
- theming
    - SCSS variables and mixins
    - ready to use themes
    
## Learn CxJS

There are many examples and learning materials available:

- [Examples](https://cxjs.io/examples)
- [Documentation](https://cxjs.io/docs)
- [Widgets & Themes Gallery](https://cxjs.io/gallery)
- [Fiddle](https://cxjs.io/fiddle)

If you need help, ask a question at [StackOverflow](https://stackoverflow.com/questions/tagged/cxjs). 
If you find a bug, please [raise an issue](https://github.com/codaxy/cxjs/issues). 
There is also a Slack channel. Please [request an invite](https://cxjs.io/support) 
and become a part of the CxJS community.

## Install & Start

This repository is used to develop main npm packages, documentation and gallery.
 
First, install the packages using `npm` or `yarn`.

```bash
$ npm install
```

Run docs:
```bash
npm start
```

Run gallery:
```bash
npm run gallery
```

## Start a new project

CxJS is available as an NPM package `cx` which includes 
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

### Themes

Once you create a new project, you may want to try our ready-to-use themes:

- [cx-theme-material](https://www.npmjs.com/package/cx-theme-material)
- [cx-theme-frost](https://www.npmjs.com/package/cx-theme-frost)
- [cx-theme-dark](https://www.npmjs.com/package/cx-theme-dark)

Install a theme using `npm` or `yarn`.
 
```bash
npm install cx-theme-frost
```

Open my-app/app/index.scss and replace
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

<a href="https://cxjs.io/starter">
    <img src="https://github.com/codaxy/cx/blob/master/misc/screenshots/starter/analytics.png" alt="Cx Starter Kit" height="200px" />
</a>
<a href="https://codaxy.github.io/state-of-js-2016-explorer/">
    <img src="https://github.com/codaxy/cx/blob/master/misc/screenshots/sofjs2016/StateOfJs.png" alt="State of JS 2016 Explorer" height="200px" />
</a>
<a href="https://mstijak.github.io/tdo/">
    <img src="https://github.com/codaxy/cx/blob/master/misc/screenshots/tdo/tdo.png" alt="Tdo" height="200px" />
</a>

## License

CxJS is is free for non-commercial use. Commercial use requires a license.
Free commercial licenses are available for active open-source contributors upon request. 
Registered freelancers and contractors are eligible for special licensing programs.  
Please refer to [the website](https://cxjs.io/) for more information.





