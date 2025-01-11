const regex = /^[$_\p{ID_Start}][$_\u{200C}\u{200D}\p{ID_Continue}]*$/u;

export function isValidIdentifierName(name) {
   return regex.test(name);
}
