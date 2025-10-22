export function routeAppend(base: string, path: string): string {
   let result = base;
   if (path) {
      if (path[0] == '/') {
         if (result[result.length - 1] == '/')
            result += path.substring(1);
         else
            result += path;
      }
      else if (result[result.length - 1] == '/')
         result += path;
      else
         result += '/' + path;
   }
   return result;
}