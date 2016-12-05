# babel-preset-cx-env

This is a preset for Babel based on [babel-preset-env](https://github.com/babel/babel-preset-env)
which adds additional plugins required for Cx applications.

Usage is the same as `babel-preset-env`, e.g.:

```
// .babelrc
{
  "presets": [
    ["cx-env", {
      "modules": false,
      "loose": true,
      "targets": {
        "chrome": 54
      }
    }]
  ]
}
```