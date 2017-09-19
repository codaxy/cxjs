import {View, ViewConfig} from './View';



export class SubscribableView extends View {
   constructor(config?: ViewConfig);

   unsubscribeAll(): void;

   async: boolean;
}
