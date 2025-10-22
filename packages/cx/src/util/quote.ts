export function quoteStr(str: string): string;
export function quoteStr(str: null): null;
export function quoteStr(str: string | null): string | null {
   if (str == null) return str;
   return JSON.stringify(str);
}
