# Cx Framework

This is the core package for the [Cx Framework](https://cx.codaxy.com/). Cx is a modern framework for building visually appealing, 
data-oriented, web applications with ready to use grid, form and chart components.

For more information about the framework, please check out [the documentation](https://cx.codaxy.com/docs/intro/getting-started).

## Usage

The easiest way to set up a new Cx project is to use the [Cx Command Line Interface](http://cx.codaxy.com/v/master/docs/intro/command-line).
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

