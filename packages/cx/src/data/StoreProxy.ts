import { View } from "./View";

export class StoreProxy extends View {
   store: View;

   constructor(getStore: () => View) {
      super({
         store: getStore(),
      });

      Object.defineProperty(this, "store", {
         get: getStore,
      });
   }

   getData(): any {
      return this.store.getData();
   }
}
