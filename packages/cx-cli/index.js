#! /usr/bin/env node

let program = require("commander"),
   pkg = require("./package.json");

let { addRoute, createNewApp } = require("./commands");

program
   .version(pkg.version)
   .option("create", "Create a new project directory with the basic app structure")
   .option("add, route", "Add new route folder")
   .parse(process.argv);

console.log("Cx CLI v" + pkg.version);

if (program.create)
   createNewApp(program.args[0]);
else if (program.route) {
   let routeName = program.args[0];
   console.log();
   if (!routeName) {
      console.log("Syntax error: missing route name. Correct syntax: cx add route <route_name>.");
      return;
   }
   addRoute(routeName);
}







