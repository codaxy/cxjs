#!/usr/bin/env node

var execSync = require('child_process').execSync;

var useYarn = shouldUseYarn();

execSync(useYarn ? 'yarn global add cx-cli' : 'npm install cx-cli --global', {stdio: 'inherit'});

var projectName = process.argv[2];
var args = ['create'];
if (projectName) args.push(projectName);
if (useYarn) args.push('--yarn');

execSync('cx ' + args.join(' '), {stdio: 'inherit'});

function shouldUseYarn() {
   try {
     execSync('yarnpkg --version', { stdio: 'ignore' });
     return true;
   } catch (e) {
     return false;
   }
}