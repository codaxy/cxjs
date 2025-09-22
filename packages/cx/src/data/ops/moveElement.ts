export function moveElement<T>(array: T[], sourceIndex: number, targetIndex: number): T[] {
   if (sourceIndex === targetIndex) return array;

   const result = [...array];
   const element = result[sourceIndex];

   if (sourceIndex < targetIndex) {
      for (let i = sourceIndex; i < targetIndex - 1; i++) {
         result[i] = result[i + 1];
      }
      result[targetIndex - 1] = result[targetIndex];
      targetIndex--;
   } else {
      for (let i = sourceIndex; i > targetIndex; i--) {
         result[i] = result[i - 1];
      }
   }

   result[targetIndex] = element;
   return result;
}
