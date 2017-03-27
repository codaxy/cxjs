export function filter(array, callback) {
   var result = array.filter(callback);
   if (result.length == array.length)
      return array;
   return result;
}
