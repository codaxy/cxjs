# babel-preset-cx-env

This preset sets up Babel for [CxJS](https://cxjs.io) applications.

The preset includes the following plugins:
- `@babel/proposal-class-properties`
- `@babel/proposal-function-bind`
- `@babel/transform-react-jsx`
- `babel-plugin-transform-cx-jsx`
- `babel-plugin-transform-cx-imports`

You can set it up in your `babel.config.js` file:
```json
{
    presets: [
        ["babel-preset-cx-env", {
            cx: {
                jsx: {
                    trimWhitespace: false
                },
                imports: {
                    useSrc: true
                }
            }
        }]
    ]
}
```

