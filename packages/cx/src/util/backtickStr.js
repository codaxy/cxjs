export function backtickStr(str) {
   if (str == null) return str;
   return "`" + str.replace(/`/g, "\\`") + "`";
}
