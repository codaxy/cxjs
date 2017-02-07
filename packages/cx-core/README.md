# Cx Framework

This is the core package for the [Cx Framework](https://cxjs.io/). 
Cx is a feature-rich framework for building modern web applications.

It provides:
- a complete set of widgets 
- charts
- two-way data-binding options
- controllers
- layouts
- customizable appearance (Sass)

Cx is based on ES6 and requires babel-plugin-transform-cx-jsx. 
Cx widgets use React to render and update the DOM.

## Demo Applications

<a href="http://cxjs.io/starter">
    <img src="https://github.com/codaxy/cx/blob/master/misc/screenshots/starter/analytics.png" alt="Cx Starter Kit" height="200px" />
</a>
<a href="https://codaxy.github.io/state-of-js-2016-explorer/">
    <img src="https://github.com/codaxy/cx/blob/master/misc/screenshots/sofjs2016/StateOfJs.png" alt="State of JS 2016 Explorer" height="200px" />
</a>
<a href="https://mstijak.github.io/tdo/">
    <img src="https://github.com/codaxy/cx/blob/master/misc/screenshots/tdo/tdo.png" alt="Tdo" height="200px" />
</a>

### Getting Started

- [Documentation](http://cxjs.io/docs)
- [Themes](http://cxjs.io/themes)
- [Fiddle](http://cxjs.io/fiddle)

### Intallation

The easiest way to set up a new Cx project is to use the [Cx Command Line Interface](http://cxjs.io/v/master/docs/intro/command-line).
If you wish to install the cx-core package separately, run the following line from the project folder in your command prompt:

```
npm i cx-core -S
```

In order to use the simplified import paths for the Cx components, as listed in the documentation, 
it is important to add the following alias to your webpack config:

```
alias: {
   cx: 'cx-core/src'
}
```

### License

Cx is available under a commercial and a non-commercial license.
Please refer to the website for more information.