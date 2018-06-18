let lastZIndex = 10000;

export class ZIndexManager {
   static next() {
      return ++lastZIndex;
   }

   static reset(zIndex) {
      lastZIndex = zIndex;
   }
}
