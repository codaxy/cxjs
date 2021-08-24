# Cx Command Line Interface

This is a command line tool for the [CxJS framework](https://cxjs.io/).
Cx requires tools such as babel and webpack, which are plugin-based and require a
significant amount of work to configure properly.

Cx CLI helps you quickly set up new CxJS projects based on available application templates.

## Usage

Install the `cx-cli` tool:

```
npm install cx-cli --global
```

### Create a new project

You can easily create new projects with the following commands:

```
cx create my-app
cd my-app
npm start
```

If you're using the Yarn package manager, you can also use the `yarn create` command:

```
yarn create cx-app my-app
cd my-app
yarn start
```

### Adding a new route to the existing project

```
cx add route <route_name>
```

This command creates a new folder - `app/routes/<route_name>` and copies the `index.js` and `Controller.js` files from the template.
