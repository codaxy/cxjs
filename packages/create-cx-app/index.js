#! /usr/bin/env node

const { createNewApp } = require("cx-cli/commands");

const projectName = process.argv[2];

if (!projectName) {
   console.error('Please specify the project name.');
   process.exit(-1);
}

createNewApp(projectName);
