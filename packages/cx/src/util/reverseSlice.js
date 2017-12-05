export function reverseSlice(array, start) {
   let last = array.length - 1;
   while (start < last) {
      let x = array[start];
      array[start] = array[last];
      array[last] = x;
      start++;
      last--;
   }
}