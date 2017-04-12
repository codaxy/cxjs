import * as Cx from '../core';

interface DecoratorFactory<T> {
   (t: T): T;
}

export class Component {

   /**
    * 
    * @param {any} type 
    * @param {object} config
    * @param {object} more 
    */
   static create(typeAlias?: any, config?: object, more?: object): any;
   
   /**
    * 
    * @param alias 
    * @param type 
    */
   static alias<T>(alias: string, type: T);
   static alias<T>(alias: string) : DecoratorFactory<T>;

}


