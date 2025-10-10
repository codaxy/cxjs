import {View} from "./View";

export class StoreProxy extends View {
   constructor(getStore: () => View) {
      super({
         store: getStore()
      });

      Object.defineProperty(this, "store", {
         get: getStore
      });
   }

   getData(): any {
      return this.store.getData();
   }
}