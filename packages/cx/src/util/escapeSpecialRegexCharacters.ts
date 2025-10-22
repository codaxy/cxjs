/**
 *
 * @param s
 * @return {string}
 */
export function escapeSpecialRegexCharacters(s: string): string {
   return s.replace(/[\\^$*+?.()|[\]{}]/g, '\\$&');
}
