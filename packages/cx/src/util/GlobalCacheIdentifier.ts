var globalCacheIdentifier: number = 1;

export class GlobalCacheIdentifier {
   static get(): number {
      return globalCacheIdentifier;
   }

   static change(): void {
      globalCacheIdentifier++;
   }
}
