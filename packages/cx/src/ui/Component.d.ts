import * as Cx from '../core';

interface DecoratorFactory<T> {
   (t: T): T;
}

export class Component {

   init();

   /**
    * 
    * @param alias 
    * @param type 
    */
   static alias<T>(alias: string, type: T);
   static alias<T>(alias: string) : DecoratorFactory<T>;

   /**
    * 
    * @param type
    * @param config
    * @param more
    */
   static create(typeAlias?: any, config?: object, more?: object): any;

   isComponent: boolean;
   
   static isComponentType: boolean;
   static namespace: string;
   static lazyInit: boolean;

   static factory(alias: string, config: Cx.Config, more?: Cx.Config) : Component;

}


