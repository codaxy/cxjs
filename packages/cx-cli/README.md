# Cx Command Line Interface

## Usage

If you didn't do so already, initialize the
`package.json` file using `npm init`.

Install `cx-cli` tools:
```
npm i cx-cli [--global]
```
 
For new projects, use `scaffold` to create basic app structure.
```
cx scaffold [--yarn]
```
Append `--yarn` to use `yarn` package manager to install packages.


Alternatively, use `install` to add packages into an existing project structure:
```
cx install [--yarn]
```
Please note that this will add `cx`, `react`, `babel` and `sass` related packages.


Start your application using:
```
cx start
```

Make a production `build`:
```
cx build
```


