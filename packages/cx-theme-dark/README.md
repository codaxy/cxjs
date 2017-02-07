# Dark theme

This is a theme package for the [Cx framework](https://cxjs.io/).

Dark theme eases the stress on your eyes caused by long hours of use. 
Hence, it's commonly used for long-running tools and applications.
Take a look at theme preview and compare it to the other themes [here](https://cxjs.io/v/master/themes/).

## Usage

In order to use the theme, install its npm package:

```
npm install cx-theme-dark
```
Then, import Cx styles from the package:
```
// theme variables can be overridden here

@import "~cx-theme-dark/src/variables";

// theme state-style-maps can be overridden here, before importing css  

@import "~cx-theme-dark/src/index";

// add custom CSS here
```
To learn more about Cx styling and how to customize it, 
[click here](https://cxjs.io/v/master/docs/concepts/css).