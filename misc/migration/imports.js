//This is a node script that goes through the codebase and replaces old import style with a new one

//npm i globby
//update srcFiles
//make sure production is false
//after you're sure it's working
//set production to true

//Please backup (commit) files before running this tool


var fs = require('fs'),
   path = require('path'),
   globby = require('globby');


const srcFiles = [
   path.resolve(__dirname, '../../themes/**/*.js'),
   //path.resolve(__dirname, '../../litmus/**/*.js'),
   //path.resolve(__dirname, '../../docs/**/*.js'),
   "!dist"
];

var replacements = {
   'cx/data/': 'cx/data',
   'cx/util/': 'cx/util',
   'cx/app/error': false,
   'cx/app/': 'cx/ui',
   'cx/ui/svg/charts': 'cx/charts',
   'cx/ui/svg/': 'cx/svg',
   'cx/ui/form/': 'cx/widgets',
   'cx/ui/grid/': 'cx/widgets',
   'cx/ui/nav/': 'cx/widgets',
   'cx/ui/overlay/': 'cx/widgets',
   'cx/ui/layout/FlexBox': 'cx/widgets',
   'cx/ui/layout/FlexRow': 'cx/widgets',
   'cx/ui/layout/FlexCol': 'cx/widgets',
   'cx/ui/Button': 'cx/widgets',
   'cx/ui/Container': 'cx/widgets',
   'cx/ui/Cx': 'cx/widgets',
   'cx/ui/Section': 'cx/widgets',
   'cx/ui/CxCredit': 'cx/widgets',
   'cx/ui/DocumentTitle': 'cx/widgets',
   'cx/ui/HtmlElement': 'cx/widgets',
   'cx/ui/List': 'cx/widgets',
   'cx/ui/Repeater': 'cx/widgets',
   'cx/ui/Sandbox': 'cx/widgets',
   'cx/ui/PureContainer': 'cx/widgets',
   'cx/ui/StaticText': 'cx/widgets',
   'cx/ui/Text': 'cx/widgets',
   'cx/ui/': 'cx/ui',
};

var importPattern = /import {(.*)} from ["'](cx.*)["'];?\n?/g;

//group imports from the same file
var group = true;

//do a test run first
var production = false;

globby(srcFiles)
   .then(x => {
      x.forEach(f=> {
         console.log(' ');
         console.log(f);
         var contents = fs.readFileSync(f, { encoding: 'utf8' });
         //console.log(contents);
         var importPaths = {};
         var index = 0;
         var result = contents.replace(importPattern, (match, imports, path) => {
            //console.log(replacements);
            for (let rep in replacements) {
               if (!replacements[rep]) //skip
                  continue;
               //console.log(match, path, rep);
               if (path.indexOf(rep) == 0) {
                  console.log(path, '=>', replacements[rep]);
                  if (group) {
                     let im = importPaths[replacements[rep]];
                     if (!im)
                        im = importPaths[replacements[rep]] = {};
                     imports.split(',').forEach(name=>{
                        im[name.trim()] = true
                     });
                     return '';
                  }
                  return `import ${imports} from '${replacements[rep]}';`;
               }
            }
            console.warn('Unmatched import: ', match);
            return match;
         });

         if (group) {
            var h = '';
            for (var path in importPaths) {
               h += `import \{ ${Object.keys(importPaths[path]).join(', ')} \} from '${path}';\n`;
            }
            result = h + result;
         }

         if (production && result != contents)
            fs.writeFileSync(f, result);
      })
   })
   .catch(e => {
      console.log(e);
   });
