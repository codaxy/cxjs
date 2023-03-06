export function quoteStr(str) {
   if (str == null) return str;
   return JSON.stringify(str);
}
