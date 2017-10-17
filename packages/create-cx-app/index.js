#!/usr/bin/env node

var execSync = require('child_process').execSync;
//const spawn = require('cross-spawn');

var useYarn = shouldUseYarn();
var projectName = process.argv[2];

// if (useYarn) {
//   spawn.sync('yarn', ['global', 'add', 'cx-cli'], {stdio: 'inherit'});
// } else {
//   spawn.sync('npm', ['install', 'cx-cli', '--global'], {stdio: 'inherit'});
// }
execSync(useYarn ? 'yarn global add cx-cli' : 'npm install cx-cli --global', {stdio: 'inherit'});

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