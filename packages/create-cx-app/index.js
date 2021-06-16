let { createNewApp } = require("cx-cli/commands");

let projectName = process.argv[2];

if (!projectName) {
   console.error('Please specify the project name.');
   process.exit(-1);
}

createNewApp(projectName);
