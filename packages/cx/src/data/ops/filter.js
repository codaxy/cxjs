export function filter(array, callback) {
   if (array == null)
      return array;
   let result = array.filter(callback);
   if (result.length == array.length)
      return array;
   return result;
}
