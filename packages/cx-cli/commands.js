const
   path = require('path'),
   fs = require('fs'),
   copydir = require('copy-dir'),
   request = require('request'),
   unzip = require('unzipper'),
   chalk = require("chalk"),
   cliSelect = require("cli-select"),
   templates = require('./app-templates.json');

function getAppPath() {
   let at = process.cwd();
   let cnt = 0;
   do {
      if (fs.existsSync(path.join(at, 'package.json'))) return at;
      if (++cnt == 20 || at.lastIndexOf(path.sep) <= 0)
         throw new Error("Could not find package.json in any of the parent folders.");
      at = path.resolve(at, "..");
      cnt++;
   }
   while (true);
}

function addRoute(routeName) {
   let appPath = getAppPath();
   let newRoute = routeName.split('/');
   let tplDir = path.join(__dirname, './tpl/', 'route');

   // initial route parent folder
   let parentDir = path.join(appPath, './app/routes/');
   if (!fs.existsSync(parentDir))
      throw new Error("Could not find the app/routes folder.");

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

function downloadAndExtractZip(url, extractPath, srcFolder) {

   if (fs.existsSync(extractPath))
      throw new Error(`The folder ${extractPath} already exists.`);

   var appName = extractPath.match(/([^\/]*)\/*$/)[1];
   let extractFolder = extractPath;
   if (srcFolder) {
      extractFolder = extractFolder.substring(0, extractPath.length - appName.length - 1);
   }

   return new Promise((resolve, reject) => {
      request
         .get(url)
         .pipe(unzip.Extract({
            path: extractFolder
         }))
         .on('close', function () {
            if (srcFolder) {
               fs.renameSync(
                  path.join(extractFolder, srcFolder),
                  path.join(extractFolder, appName)
               );
            }
            resolve();
         })
         .on('error', function (error) {
            reject(error);
         });
   })
}

async function pickAppTemplate() {
   let values = {};

   //TODO: Load application templates from internet.

   for (let t of templates)
      values[t.url] = t.name;

   console.log("Please select the desired application template:");

   let option = await cliSelect({
      values,
      defaultValue: 0,
      valueRenderer: (value, selected) => (selected ? chalk.yellow(value) : value),
   });

   return option;
}


async function createNewApp(projectName) {
   if (!projectName) {
      console.error("Please specify the project directory:");
      console.log(
         `  ${chalk.cyan(useYarn ? "yarn create cx-app" : "create-cx-app")} ${chalk.green("<project-directory>")}`
      );
      console.log();
      return;
   }
   let template = await pickAppTemplate();
   console.log(`Downloading ${template.value} template into the application folder ${projectName}.`);
   try {
      await downloadAndExtractZip(templates[0].url, projectName, templates[0].srcFolder);
   }
   catch (err) {
      console.log("Failed to download and extract the template.", err);
      return;
   }
   console.log(`The application has been succesfully set up in the folder ${projectName}. You should now go into the folder and install NPM packages.`);
}


module.exports = {
   addRoute,
   createNewApp
};