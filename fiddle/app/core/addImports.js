import * as Cx from 'cx';
import { rewriteImports, getImportedNames } from './groupImports';
//let Cx = {};

function findPath(path, ns, name, goDeep = true) {

   if (!ns)
      return false;

   if (name in ns)
      return path;

   if (goDeep) {
      for (let item in ns)
         if (ns.hasOwnProperty(item) && typeof ns[item] == 'object') {
            let result = findPath(path + item, ns[item], name, false);
            if (result)
               return result;
         }
   }

   return false;
}

export function addMissingImport(code, name) {
   code = code || '';

   let imports = getImportedNames(code);

   if (!imports[name]) {
      let path = findPath('/', Cx, name);
      if (path)
         code = `import \{ ${name} \} from 'cx${path}';\n` + code;
   }

   return code;
}

export function addMissingImports(code) {
   code = code || '';

   let imports = getImportedNames(code);

   let missingImports = {
      'HtmlElement': true
   };

   let tagMatcher = /<\w(\w*)(\s|>|\/)/g;
   let tags = code.match(tagMatcher);
   if (tags)
      for (let tag of tags) {
         let tagName = tag.substring(1, tag.length - 1);
         if (tagName.substring(0, 1) == tagName.substring(0, 1).toUpperCase())
            missingImports[tagName] = true;
      }

   let typeMatcher = /={\w(\w*)}/g;
   let types = code.match(typeMatcher);
   if (types)
      for (let type of types) {
         let typeName = type.substring(2, type.length - 1).trim();
         missingImports[typeName] = true;
      }

   for (let name in missingImports)
      if (!imports[name]) {
         let path = findPath('/', Cx, name);
         if (path)
            code = `import \{ ${name} \} from 'cx${path}';\n` + code;
      }

   return rewriteImports(code);
}
