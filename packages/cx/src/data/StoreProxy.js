import {View} from "./View";

export class StoreProxy extends View {
   constructor(getStore) {
      super({
         store: getStore()
      });

      Object.defineProperty(this, "store", {
         get: getStore
      });
   }

   getData() {
      return this.store.getData();
   }
}