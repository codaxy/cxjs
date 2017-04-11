import * as Cx from '../core';

export class Component {

   /**
    * 
    * @param {} type 
    * @param {object} config
    * @param {object} more 
    */
   static create(typeAlias?: any, config?: object, more?: object): any;
   
   /**
    * 
    * @param alias 
    * @param type 
    */
   static alias(alias: any, type?: {}): void;

}


