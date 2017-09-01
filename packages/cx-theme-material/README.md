# Material Theme

This is a package that enables Material Design like appearance for the [CxJS framework](https://cxjs.io/).
Take a look at the theme preview and compare it to the other themes [here](https://cxjs.io/v/master/themes/).

## Usage

In order to use the theme, install its npm package:

```
npm install cx-theme-material
```

Import theme's JavaScript. If you want material design label and validation behavior, do the following:

```
import { enableMaterialLabelPlacement, enableMaterialHelpPlacement } from "cx-theme-material";

enableMaterialLabelPlacement();
enableMaterialHelpPlacement();
```

otherwise, just import the theme:

```
import "cx-theme-material";
```

Then, import theme styles from the package by adding the following snippet to one of your SCSS files:
```
// theme variables can be overridden here

@import "~cx-theme-material/src/variables";

// theme state-style-maps can be overridden here, before importing css

@import "~cx-theme-material/src/index";

// add custom CSS here
```

If you are using `cx-scaffold` to start, be sure to replace the line under the comment inside `config/webpack.config.js`:
```
//add here any ES6 based library
include: /[\\\/](app|cx|cx-react)[\\\/]/,
```
with the following:
```
//add here any ES6 based library
include: /[\\\/](app|cx|cx-react|cx-theme-material)[\\\/]/,
```
Finally, don't forget to add `material icons` to your project, as described [here](https://google.github.io/material-design-icons/#icon-font-for-the-web).

To learn more about Cx styling and how to customize it, 
[click here](https://cxjs.io/v/master/docs/concepts/css).