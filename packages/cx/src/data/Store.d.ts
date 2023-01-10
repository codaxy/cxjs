import { View, ViewConfig } from "./View";

interface StoreConfig<D = any> extends ViewConfig {
   async?: boolean;
   data?: D;
}

export class Store<D = any> extends View<D> {
   constructor(config?: StoreConfig<D>);

   unsubscribeAll(): void;

   async: boolean;
}
