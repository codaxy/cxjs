#!/usr/bin/env node

var spawn = require('cross-spawn');

var useYarn = shouldUseYarn();
var projectName = process.argv[2];

var commands = ['run', 'execute', '--', 'create'];
if (projectName) commands.push(projectName);
if (useYarn) commands.push('--yarn');
spawn.sync('npm', commands, {stdio: 'inherit'});

function shouldUseYarn() {
   try {
     execSync('yarnpkg --version', { stdio: 'ignore' });
     return true;
   } catch (e) {
     return false;
   }
}