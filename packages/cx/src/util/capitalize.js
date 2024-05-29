export function capitalize(str) {
   if (typeof str != "string") return str;
   return str.charAt(0).toUpperCase() + str.substring(1);
}
