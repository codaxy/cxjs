#!/usr/bin/env node

var execSync = require('child_process').execSync;
var exec = require('child_process').exec;

var useYarn = shouldUseYarn();
var projectName = process.argv[2];

var args = ['create'];
if (projectName) args.push(projectName);
if (useYarn) args.push('--yarn');
exec('cx ' + args.join(' '), {stdio: 'inherit'});


function shouldUseYarn() {
   try {
     execSync('yarnpkg --version', { stdio: 'ignore' });
     return true;
   } catch (e) {
     return false;
   }
}