const regex = /^[$_\p{ID_Start}][$_\u{200C}\u{200D}\p{ID_Continue}]*$/u;

export function isValidIdentifierName(name: string): boolean {
   return regex.test(name);
}
