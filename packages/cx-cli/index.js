#! /usr/bin/env node

let program = require("commander"),
    pkg = require("./package.json");

let {addRoute, createNewApp} = require("./commands");

console.log("Cx CLI v" + pkg.version);

program.version(pkg.version);

program.command("create")
    .description("Create a new project directory with the basic app structure")
    .argument('<name>', 'project directory')
    .action((name) => {
        createNewApp(name);
    });

program.command("add, route")
    .description("Add new route folder")
    .argument('<name>', 'route folder')
    .action((routeName) => {
        addRoute(routeName);
    });

program.parse();
