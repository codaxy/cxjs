export function getRangeOverlap(a1, a2, b1, b2) {
   return Math.max(0, Math.min(a2, b2) - Math.max(a1, b1));
}