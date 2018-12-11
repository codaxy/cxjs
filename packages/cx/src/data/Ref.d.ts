import {View} from './View';

interface RefConfig {
   store: View,
   path: string
}

export class Ref<T = any> {

   constructor(config: RefConfig);

   init(value: T): boolean;

   set(value: T): boolean;

   delete(): boolean;

   get(): T;

   toggle(): boolean;

   update(updateFn: (currentValue: T, ...args) => T, ...args): boolean;
}
