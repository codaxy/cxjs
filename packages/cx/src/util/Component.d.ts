import * as Cx from '../core';

interface DecoratorFactory<T> {
   (t: T): T;
}

export class Component {

   constructor(config?: Cx.Config);

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
   static create(typeAlias?: any, config?: Cx.Config, more?: Cx.Config): any;

   isComponent: boolean;
   
   static isComponentType: boolean;
   static namespace: string;
   static autoInit: boolean;

   static factory(alias: string, config: Cx.Config, more?: Cx.Config) : Component;

}


export function createComponentFactory(factory, meta);

export function isComponentFactory(factory: any): boolean;