# Aquamarine Theme

This is a package that enables a different appearance for your [CxJS](https://cxjs.io/) applications.
Take a look at the theme preview and compare it to the other themes [here](https://gallery.cxjs.io/).

## Usage

In order to use the theme, install its npm package:

```
npm install cx-theme-aquamarine
```

Import theme's JavaScript. 

```
import "cx-theme-aquamarine";
```

Then, import theme styles from the package by adding the following snippet to one of your SCSS files:
```
// theme variables can be overridden here

@import "~cx-theme-aquamarine/src/variables";

// theme state-style-maps can be overridden here, before importing css

@import "~cx-theme-aquamarine/src/index";

// add custom CSS here
```
To learn more about Cx styling and how to customize it, 
[click here](https://cxjs.io/v/master/docs/concepts/css).