#!/usr/bin/env node

var execSync = require('child_process').execSync;

var useYarn = shouldUseYarn();

var execute = require('cx-cli/execute');

var projectName = process.argv[2];

var argv = process.argv.slice(0, 2);
argv.push('create', projectName);

if (useYarn)
   argv.push("--yarn");

execute(argv);
function shouldUseYarn() {
   try {
     execSync('yarnpkg --version', { stdio: 'ignore' });
     return true;
   } catch (e) {
     return false;
   }
}