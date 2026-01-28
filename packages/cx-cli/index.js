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

program.command("add")
    .description("Add new route folder")
    .argument('<type>')
    .argument('<name>', 'route folder')
    .action((type, name) => {
        if (type === "route") {
            addRoute(name);
        } else {
            console.error(`Invalid type! Expected 'cx add route <name>', found 'cx add ${type} ${name}'.`);
        }
    });

program.parse();
