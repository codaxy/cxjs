import { isString } from "./isString";
import { isFunction } from "./isFunction";
import { isArray } from "./isArray";

const componentAlias = {};

export class Component {
   public static namespace: string;
   public static isComponentType: boolean;
   public static autoInit: boolean;
   public static factory: (alias: any, config?: any, more?: any) => any;
   public isComponent?: boolean;

   constructor(config?: any) {
      if (config && config.$props) {
         Object.assign(config, config.$props);
         delete config.$props;
      }
      Object.assign(this, config);
   }

   static alias(alias: string, type?: any) {
      if (type) {
         type.prototype.componentAlias = alias;
         componentAlias[this.namespace + alias] = type;
      } //decorator usage
      else
         return (t: any) => {
            this.alias(alias, t);
            return t;
         };
   }

   static create(typeAlias: any, config?: any, more?: any): any {
      if (!typeAlias) return this.factory(typeAlias, config, more);

      if (typeAlias.isComponent) return typeAlias;

      if (isComponentFactory(typeAlias)) return this.create(typeAlias.create(config), config, more);

      if (isArray(typeAlias)) return typeAlias.map((c) => this.create(c, config, more));

      if (typeAlias.$type) return this.create(typeAlias.$type, typeAlias, config);

      if (typeAlias.type) return this.create(typeAlias.type, typeAlias, config);

      let cmpType: any, alias: string;

      if (typeAlias.isComponentType) cmpType = typeAlias;
      else if (isFunction(typeAlias)) {
         if (this.factory) return this.factory(typeAlias, config, more);
         throw new Error(`Unsupported component type ${typeAlias}.`);
      } else if (isString(typeAlias)) {
         alias = this.namespace + typeAlias;
         cmpType = componentAlias[alias];
         if (!cmpType) {
            if (typeAlias && this.factory) return this.factory(typeAlias, config, more);
            throw new Error(`Unknown component alias ${alias}.`);
         }
      } else if (typeof typeAlias == "object") {
         cmpType = typeAlias.type || typeAlias.$type;
         if (!cmpType) {
            cmpType = this;
            more = more ? Object.assign({}, config, more) : config;
            config = typeAlias;
         }
      }

      if (isArray(config)) return config.map((cfg) => this.create(cmpType, cfg, more));

      let cfg = config;

      if (more) cfg = Object.assign({}, config, more);

      let cmp = new cmpType(cfg);
      if (cmpType.autoInit && cmp.init) cmp.init();
      return cmp;
   }
}

Component.prototype.isComponent = true;

Component.isComponentType = true;
Component.namespace = "";
Component.autoInit = false;

Component.factory = (alias: string, _config?: any, _more?: any) => {
   throw new Error(`Unknown component alias ${alias}.`);
};

export function createComponentFactory(factory: any, jsxDriver: any, meta?: any) {
   factory.$isComponentFactory = true;
   factory.$meta = meta;
   factory.create = jsxDriver;
   return factory;
}

export function isComponentFactory(factory: any): boolean {
   return factory && factory.$isComponentFactory;
}
