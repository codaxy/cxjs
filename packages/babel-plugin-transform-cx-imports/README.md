# babel-plugin-transform-cx-imports

This plugin rewrites application imports to use Cx source files
 and optionally include sass imports.

### Usage

```
//.babelrc
"plugins": [
    "transform-cx-imports"
]
```

Optionally, if you want to include scss files for each plugin, use:

```
//.babelrc
"plugins": [
    ["transform-cx-imports", { sass: true }]
]
```
