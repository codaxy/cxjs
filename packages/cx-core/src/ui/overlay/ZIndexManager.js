let lastZIndex = 10000;

export class ZIndexManager {
   static next() {
      return ++lastZIndex;
   }
}
