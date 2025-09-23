export function append<T>(array: T[], ...items: T[]): T[] {
   if (items.length === 0) return array ?? [];
   if (!array) return items;
   return [...array, ...items];
}
