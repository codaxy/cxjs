export function escapeSpecialRegexCharacters(s) {
   return s.replace(/[\\^$*+?.()|[\]{}]/g, '\\$&');
}
