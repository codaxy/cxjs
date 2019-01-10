#! /usr/bin/env node
let
   path = require('path'),
   fs = require('fs'),
   spawn = require('cross-spawn'),
   copydir = require('copy-dir'),
   chalk = require('chalk');

let tplPath = path.join(__dirname, './tpl/'),
   tplPackagePath = path.join(tplPath, 'package.json');

function getAppPath() {
   return process.cwd();
}

function getAppPackagePath() {
   return path.join(getAppPath(), 'package.json')
}

function validateAppPackage() {
   if (!fs.existsSync(getAppPackagePath())) {
      console.warn('package.json could not be found in the current directory.');
      return false;
   }
   return true;
}

function install(useYarn) {
   if (!validateAppPackage())
      return;

   console.log('Installing necessary packages using ' + (useYarn ? 'yarn' : 'npm') + '.');
   let appPkgPath = getAppPackagePath();

   let appPkg = require(appPkgPath);
   let tplPkg = require(tplPackagePath);

   if (tplPkg.scripts) {
      if (!appPkg.scripts)
         appPkg.scripts = {};

      for (let name in tplPkg.scripts) {
         if (appPkg.scripts[name]) {
            console.warn('Script ' + name + ' skipped as it is already in package.json.');
         } else {
            appPkg.scripts[name] = tplPkg.scripts[name];
         }
      }
   }

   if (tplPkg.dependencies) {
      if (!appPkg.dependencies)
         appPkg.dependencies = {};

      for (let name in tplPkg.dependencies) {
         if (appPkg.dependencies[name]) {
            console.warn('Dependency ' + name + ' skipped as it is already in package.json.');
         } else {
            appPkg.dependencies[name] = tplPkg.dependencies[name];
         }
      }
   }

   if (tplPkg.devDependencies) {
      if (!appPkg.devDependencies)
         appPkg.devDependencies = {};

      for (let name in tplPkg.devDependencies) {
         if (appPkg.devDependencies[name]) {
            console.warn('Dev-dependency ' + name + ' skipped as it is already in package.json.');
         } else {
            appPkg.devDependencies[name] = tplPkg.devDependencies[name];
         }
      }
   }

   fs.writeFileSync(appPkgPath, JSON.stringify(appPkg, null, 2));

   console.log('Scripts and dependencies added to package.json! Installing...');

   if (useYarn) {
      return spawn.sync('yarn', [], {stdio: 'inherit'});
   } else {
      return spawn.sync('npm', ['install'], {stdio: 'inherit'});
   }
}

function scaffold(useYarn) {
   let appPath = getAppPath();
   let files = fs.readdirSync(appPath);
   let test = ["index.js", "index.html", "index.scss"];
   for (let i = 0; i < test.length; i++) {
      if (files.indexOf(test[i]) != -1) {
         console.error('App files detected. Aborting to prevent overwrites...');
         return -1;
      }
   }

   let err = copydir.sync(tplPath, appPath, function (stat, filepath, filename) {
      //skip package.json and _template folder
      if (filepath.indexOf('_template') != -1 || filename == 'package.json')
         return false;
      return true;
   });

   if (err) {
      console.error('Copy error.', err);
      return -1;
   }

   return install(useYarn);
}

function create(projectName, useYarn) {
   let root = path.resolve(projectName);

   // check if project directory already exists
   if (fs.existsSync(root)) {
      console.error("Folder '" + chalk.green(root) + "' already exists. Aborting to prevent overwrites...");
      console.log();
      return;
   }

   fs.mkdirSync(projectName);
   process.chdir(root);

   // init package.json
   spawn.sync('npm', ['init', '-y'], {stdio: 'inherit'});
   return scaffold(useYarn);
}

function addRoute(routeName) {
   let appPath = getAppPath();
   let newRoute = routeName.split('/');
   let tplDir = path.join(tplPath, './app/routes/_template');

   // initial route parent folder
   let parentDir = path.join(appPath, './app/routes/');

   // loop through newRoute sub dirs array
   // for each sub, check if it exists and create it if it doesn't
   newRoute.reduce(function (parentDir, route, i) {
      let newRouteDir = path.join(parentDir, route);
      // if last element in the route array, copy template files
      // otherwise just check if the sub folder exists and create it
      if (i === newRoute.length - 1) {
         if (!fs.existsSync(newRouteDir)) {
            fs.mkdirSync(newRouteDir);
            let err = copydir.sync(tplDir, newRouteDir);
            if (err) {
               console.error('Copy error.', err);
            } else {
               console.log("New route folder 'app/routes/" + newRoute.join('/') + "' created.");
            }
         } else {
            console.error("Folder 'app/routes/" + newRoute.join('/') + "' already exists.");
         }
      } else {
         if (!fs.existsSync(newRouteDir))
            fs.mkdirSync(newRouteDir);
      }
      return newRouteDir;
   }, parentDir);
}

module.exports = {
   scaffold: scaffold,
   install: install,
   create: create,
   addRoute: addRoute
};