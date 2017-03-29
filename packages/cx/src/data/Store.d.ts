import {View, ViewConfig} from './View';

interface StoreConfig extends ViewConfig {
   async?: boolean;
   data?: any;
}

export class Store extends View {
   constructor(config?: StoreConfig);

   unsubscribeAll(): void;

   async: boolean;
}
