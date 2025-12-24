export function capitalize(str: string): string {
   if (typeof str != "string") return str;
   return str.charAt(0).toUpperCase() + str.substring(1);
}
