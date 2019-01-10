#!/usr/bin/env node

let execSync = require('child_process').execSync,
   create = require('cx-cli/commands').create;

let useYarn = true;
try {
   execSync('yarnpkg --version', { stdio: 'ignore' });
} catch (e) {
   useYarn = false;
}

let projectName = process.argv[2];

if (!projectName) {
   console.error('Please specify project name.');
   process.exit(-1);
}

create(projectName, useYarn);
