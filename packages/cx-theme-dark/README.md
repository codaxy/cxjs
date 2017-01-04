# Dark theme

This is a command line tool for the [Cx framework](http://cx.codaxy.com/v/master/docs/intro/about).
Cx requires tools such as babel and webpack, which are plugin-based and require a 
significant amount of work to configure properly.

Cx CLI helps you quickly set up a new Cx project that contains the basic file structure 
as well as all of the required tools and configuration code for using the framework.

## Usage

If you haven't done so already, inside the project folder initialize the `package.json`
file by running the command `npm init`.

Install the `cx-cli` tool:
```
npm install cx-cli --global
```

For new projects, use scaffold to create basic app structure.
```
cx scaffold [--yarn]
```
Append `--yarn` to use `yarn` package manager to install packages.


Alternatively, use install to add packages into an existing project structure:
```
cx install [--yarn]
```
Please note that this will add `Cx`, `React`, `Babel` and `Sass` related packages.


Start your application using:
```
cx start
```     

Make a production build:
```
cx build
```

Set up a new route folder:
```
cx add route route_name
```
This command creates a new folder - `app/routes/route_name` and copies the `index.js`, 
`index.scss` and `controller.js` files from the template.