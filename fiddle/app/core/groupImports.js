export function trim(str) {
   return str.replace(/[\s]/g, '');
}

export function innerTextTrim(str) {
   str = str.replace(/^\s+|\s+$/g, '');
   return str;
}

function getImportRegex() {
   return new RegExp('^import {([^}]+)} from [\'"](.+)[\'"];?', 'gm');
}


export function getImportedNames(code) {
   let result = {}, m;

   let importRegex = getImportRegex();

   while (m = importRegex.exec(code)) {
      let names = m[1].split(',').map(x => trim(x));

      names.forEach(n => {
         result[n] = true;
      });
   }
   return result;
}

export function rewriteImports(code) {
   let imports = {},
      m,
      lastIndex = 0,
      result = '';

   let importRegex = getImportRegex();

   while (m = importRegex.exec(code)) {
      let path = m[2];
      let names = m[1].split(',').map(x => trim(x));

      if (!imports[path])
         imports[path] = {};

      names.forEach(n => {
         imports[path][n] = true;
      });

      result += code.substring(lastIndex, m.index);
      lastIndex = m.index + m[0].length;
   }

   result += code.substring(lastIndex);

   let header = Object.keys(imports).map(k => {
      let names = Object.keys(imports[k]);
      names.sort();
      return `import \{ ${names.join(', ')} \} from '${k}';`
   }).join('\n');

   let final = header + '\n\n' + innerTextTrim(result);
   return final;
}
