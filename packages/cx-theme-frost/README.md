# Frost theme

This is a theme package for the [Cx framework](http://cx.codaxy.com/).

Frost is a winter inpspired theme.
Take a look at theme preview and compare it to the other themes [here](http://cx.codaxy.com/v/master/themes/).

## Usage

In order to use the theme, install its npm package:

```
npm install cx-theme-frost
```
Then, import Cx styles from the package:
```
// theme variables can be overridden here

@import "~cx-theme-frost/variables";

// theme state-style-maps can be overridden here, before importing css 

$cx-include-global-rules: true;
@import "~cx-theme-frost/index";

// add custom CSS here
```
To learn more about Cx styling and how to customize it, 
[click here](http://cx.codaxy.com/v/master/docs/concepts/css).