# babel-plugin-transform-cx-imports

What this is plugin is used for?
 
1. Rewrites Cx imports to use `src` files which may result with smaller builds:

`import { TextField} from 'cx/widgets'` 

becomes 

`import { TextField} from 'cx/src/form/TextField'`.

2. Include SCSS files for imported components (experimental).

`import { TextField} from 'cx/widgets'` 

adds also 

`import 'cx/src/form/TextField.scss'`.

### Usage

To use src files, use:

```
//.babelrc
"plugins": [
    ["transform-cx-imports", { useSrc: true }]
]
```
Note that if using src files, your babel/webpack configuration should whitelist `cx` path.

Optionally, if you want to include .scss files, use:

```
//.babelrc
"plugins": [
    ["transform-cx-imports", { sass: true }]
]
```
