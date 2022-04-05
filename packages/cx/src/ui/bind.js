export function bind(path, defaultValue) {
   return {
      //toString will ensure chain accessors are converted to strings
      bind: path.toString(),
      defaultValue,
   };
}
