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
To learn more about Cx styling and how to customize it, 
[click here](https://cxjs.io/v/master/docs/concepts/css).