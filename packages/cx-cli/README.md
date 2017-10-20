# Cx Command Line Interface

This is a command line tool for the [Cx framework](https://cxjs.io/v/master/docs/intro/about).
Cx requires tools such as babel and webpack, which are plugin-based and require a 
significant amount of work to configure properly.

Cx CLI helps you quickly set up a new Cx project that contains the basic file structure 
as well as all of the required tools and configuration code for using the framework.

## Usage

Install the `cx-cli` tool:
```
npm install cx-cli --global
```

### For a completely new project

To create a new scaffold project inside the current directory and start it, enter:
```
cx create-app my-app
cd my-app
npm start
```

If using `yarn` package manager:
```
cx create-app my-app --yarn
cd my-app
yarn start
```

The preferred way to set up new Cx projects is by using the `yarn create` command:
```
yarn create cx-app my-app
cd my-app
yarn start
```
By using `yarn create`, you are guaranteed to always use the latest version of Cx.

### For a pre-existing project directory

It is assumed that the project folder already containes the `package.json`.
If not, you can initilize one by running the command `npm init`.

Use `scaffold` to create basic app structure:
```
cx scaffold [--yarn]
```
Append `--yarn` to use `yarn` package manager to install packages.

Alternatively, use `install` to add packages into an existing project structure:
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