import {isString} from '../util/isString';
import {isFunction} from '../util/isFunction';
import {isArray} from '../util/isArray';

var componentAlias = {};

export class Component {
   constructor(config) {
      if (config && config.$props) {
         Object.assign(config, config.$props);
         delete config.$props;
      }
      Object.assign(this, config);
   }

   init() {}

   static alias(alias, type) {
      if (type) {
         type.prototype.componentAlias = alias;
         componentAlias[this.namespace + alias] = type;
      }
      else //decorator usage
         return t => {
            this.alias(alias, t);
            return t;
         }
   }

   static create(typeAlias, config, more) {
      if (!typeAlias)
         return this.factory(typeAlias, config, more);

      if (typeAlias.isComponent)
         return typeAlias;

      if (isComponentFactory(typeAlias))
         return this.create(typeAlias(config, more));

      if (isArray(typeAlias))
         return typeAlias.map(c => this.create(c, config, more));

      if (typeAlias.$type)
         return this.create(typeAlias.$type, typeAlias, config);

      if (typeAlias.type)
         return this.create(typeAlias.type, typeAlias, config);

      let cmpType, alias;

      if (typeAlias.isComponentType)
         cmpType = typeAlias;
      else if (isFunction(typeAlias)) {
         if (this.factory)
            return this.factory(typeAlias, config, more)
         throw new Error(`Unsupported component type ${typeAlias}.`);
      }
      else if (isString(typeAlias)) {
         alias = this.namespace + typeAlias;
         cmpType = componentAlias[alias];
         if (!cmpType) {
            if (typeAlias && this.factory)
               return this.factory(typeAlias, config, more);
            throw new Error(`Unknown component alias ${alias}.`);
         }
      }
      else if (typeof typeAlias == 'object') {
         cmpType = typeAlias.type || typeAlias.$type;
         if (!cmpType) {
            cmpType = this;
            more = more ? Object.assign({}, config, more) : config;
            config = typeAlias;
         }
      }

      if (isArray(config))
         return config.map(cfg => this.create(cmpType, cfg, more));

      let cfg = config;

      if (more)
         cfg = Object.assign({}, config, more);

      let cmp = new cmpType(cfg);
      if (!cmpType.lazyInit)
         cmp.init();
      return cmp;
   }
}

Component.prototype.isComponent = true;

Component.isComponentType = true;
Component.namespace = '';
Component.lazyInit = false;

Component.factory = (alias, config, more) => {
   throw new Error(`Unknown component alias ${alias}.`);
};

export function createComponentFactory(factory, meta) {
   factory.$isComponentFactory = true;
   factory.$meta = meta;
   return factory;
}

export function isComponentFactory(factory) {
   return factory && factory.$isComponentFactory;
}