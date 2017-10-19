#! /usr/bin/env node

let program = require('commander'),
   pkg = require('./package.json'),
   spawn = require('cross-spawn'),
   chalk = require('chalk');

let commands = require('./commands');

program
   .version(pkg.version)
   .option('-i, install', 'Install necessary packages')
   .option('scaffold', 'Scaffold application structure')
   .option('-s, start', 'Start the development server')
   .option('-b, build', 'Make a new production build')
   .option('create', 'Create a new project directory with the basic app structure')
   .option('--yarn', 'Use yarn instead of npm')
   .option('add, route', 'Add new route folder')
   .parse(process.argv);

let useYarn = !!program.yarn;

console.log('Cx CLI v' + pkg.version);

if (program.scaffold)
   commands.scaffold(useYarn);
else if (program.create) {
   let projectName = program.args[0];
   if (!projectName) {
      console.error('Please specify the project directory:');
      console.log(
         `  ${chalk.cyan(useYarn ? 'yarn create cx-app' : 'create-cx-app')} ${chalk.green('<project-directory>')}`
      );
      console.log();
      return;
   }
   commands.create(projectName, useYarn);
}
else if (program.install) {
   commands.install(useYarn);
}
else if (program.start || program.open) {
   console.log('npm start');
   return spawn.sync('npm', ['start'], {stdio: 'inherit'});
}
else if (program.build) {
   console.log('npm run build');
   return spawn.sync('npm', ['run', 'build'], {stdio: 'inherit'});
}
else if (program.route) {
   let routeName = program.args[0];
   console.log();
   if (!routeName) {
      console.log("Syntax error: missing route name. Correct syntax: cx add route route_name");
      return;
   }
   commands.addRoute(routeName);
}