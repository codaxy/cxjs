# Dark theme

Dark theme eases the stress on your eyes caused by long hours of use. 
Hence, it's commonly used for long-running tools and applications.

## Usage

In order to use the theme, install its npm package:

```
npm install cx-theme-dark
```
Then, import Cx styles from the package:
```
// theme variables can be overridden here

@import "~cx-theme-dark/variables";

// theme state-style-maps can be overridden here, before importing css 

$cx-include-global-rules: true;
@import "~cx-theme-dark/index";

// add custom CSS here
```
To learn more about Cx styling and how to customize it, 
[click here](http://cx.codaxy.com/v/master/docs/concepts/css).