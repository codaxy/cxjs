var program = require('commander'),
   pkg = require('../package.json'),
   path = require('path'),
   fs = require('fs'),
   spawn = require('cross-spawn'),
   copydir = require('copy-dir');


program
   .version(pkg.version)
   .option('-i, --install', 'Install necessary packages')
   .option('--init', 'Init application structure')
   .option('-s, start', 'Start the development server')
   .option('-b, build', 'Make a new production build')
   .option('--yarn', 'Use yarn instead of npm')
   .parse(process.argv);

if (program.version) {
   console.log('Cx CLI - ' + pkg.version);
}

//for test purposes
var appPath = path.join(process.cwd(), 'test'),
   appPackagePath = path.join(appPath, 'package.json'),
   tplPath = path.join(__dirname, '../tpl/'),
   tplPackagePath = path.join(tplPath, 'package.json');

console.log(appPackagePath);
var cwd = process.cwd();
process.chdir(appPath);

if (!fs.existsSync(appPackagePath)) {
   console.warn('package.json could not be found in the current directory.');
   return -1;
}

if (program.install) {
   console.log('Installing necessary packages using ' + (program.yarn ? 'yarn' : 'npm') + '.');

   var appPkg = require(appPackagePath);
   var tplPkg = require(tplPackagePath);

   if (tplPkg.scripts) {
      if (!appPkg.scripts)
         appPkg.scripts = {};

      for (var name in tplPkg.scripts) {
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

      for (var name in tplPkg.dependencies) {
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

      for (var name in tplPkg.devDependencies) {
         if (appPkg.devDependencies[name]) {
            console.warn('Dev-dependency ' + name + ' skipped as it is already in package.json.');
         } else {
            appPkg.devDependencies[name] = tplPkg.devDependencies[name];
         }
      }
   }

   fs.writeFileSync(appPackagePath, JSON.stringify(appPkg, null, 2));

   console.log('Scripts and dependencies added to package.json! Installing...');

   if (program.yarn) {
      return spawn.sync('yarn', [], {stdio: 'inherit'});
   } else {
      return spawn.sync('npm', ['install'], {stdio: 'inherit'});
   }
}

if (program.init) {
   var err = copydir.sync(tplPath, appPath);
   if (err) {
      console.error('Copy error.', err);
   }
}

if (program.start || program.open) {
   console.log('npm start');
   return spawn.sync('npm', ['start'], {stdio: 'inherit'});
}

if (program.build) {
   console.log('npm build');
   return spawn.sync('npm', ['build'], {stdio: 'inherit'});
}

process.chdir(cwd);




