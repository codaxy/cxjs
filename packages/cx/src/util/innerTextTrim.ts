/**
 *
 * @param str
 * @return {string}
 */
export function innerTextTrim(str: string): string {
   str = str.replace(/\t/g, '');
   str = str.replace(/(\s*[\r\n]\s*)/g, '');
   return str;
}
