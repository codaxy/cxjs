export function quoteStr(str) {
   if (str==null)
      return str;
   return "'" + str.replace(/'/g, "\\i") + "'";
}
