var globalCacheIdentifier = 1;

export class GlobalCacheIdentifier {
   static get() {
      return globalCacheIdentifier;
   }

   static change() {
      globalCacheIdentifier++;
   }
}
