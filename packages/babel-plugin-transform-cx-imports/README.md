# babel-plugin-transform-cx-imports

This plugin does three things:

1. rewrites `cx` based imports to `cx-core`. E.g. 
`import { TextField} from 'cx/widgets'` becomes `import { TextField} from 'cx-core/widgets'`.
  
2. optionally rewrites imports to use `src` files:
`import { TextField} from 'cx/widgets'` becomes `import { TextField} from 'cx-core/src/ui/form/TextField'`.

3. optionally includes SCSS files for imported components. E.g. 
`import { TextField} from 'cx/widgets'` adds also `import 'cx-core/src/ui/form/TextField.scss'`.

### Usage

Standard:
```
//.babelrc
"plugins": [
    "transform-cx-imports"
]
```

To use src files, use:

```
//.babelrc
"plugins": [
    ["transform-cx-imports", { useSrc: true }]
]
```
Note that if using src files, your babel/webpack configuration should whitelist `cx-core` path.

Optionally, if you want to include .scss files, use:

```
//.babelrc
"plugins": [
    ["transform-cx-imports", { sass: true }]
]
```
