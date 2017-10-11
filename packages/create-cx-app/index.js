#!/usr/bin/env node

var spawn = require('cross-spawn');
var execSync = require('child_process').execSync;

var useYarn = shouldUseYarn();
var projectName = process.argv[2];

var commands = ['create-app'];
if (projectName) commands.push(projectName);
if (useYarn) commands.push('--yarn');
spawn.sync('cx', commands, {stdio: 'inherit'});

function shouldUseYarn() {
   try {
     execSync('yarnpkg --version', { stdio: 'ignore' });
     return true;
   } catch (e) {
     return false;
   }
}