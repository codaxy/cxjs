//@ts-nocheck
export function escapeSpecialRegexCharacters(s) {
   return s.replace(/[\\^$*+?.()|[\]{}]/g, '\\$&');
}
