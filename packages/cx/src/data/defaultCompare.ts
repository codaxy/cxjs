export function defaultCompare(av: any, bv: any): number {
   if (av == null) {
      if (bv == null)
         return 0;
      return -1;
   }

   if (bv == null || av > bv)
      return 1;

   if (av < bv)
      return -1;

   return 0;
}