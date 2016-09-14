var componentAlias = {};

export class Component {
   constructor(config) {
      Object.assign(this, config);
   }

   init() {}

   static alias(alias, type) {
      if (type) {
         type.prototype.componentAlias = alias;
         componentAlias[this.namespace + alias] = type;
      }
      else //decorator usage
         return t=> {
            this.alias(alias, t);
            return t;
         }
   }

   static create(typeAlias, config, more) {
      if (!typeAlias)
         return this.factory(typeAlias, config, more);

      if (typeAlias.isComponent)
         return typeAlias;

      if (Array.isArray(typeAlias))
         return typeAlias.map(c=>this.create(c, config, more));

      if (typeAlias.$type)
         return this.create(typeAlias.$type, typeAlias, config);

      if (typeAlias.type)
         return this.create(typeAlias.type, typeAlias, config);

      var cmpType;

      if (typeAlias.isComponentType)
         cmpType = typeAlias;
      else {
         var alias = this.namespace + typeAlias;
         var cmpType = componentAlias[alias];
         if (!cmpType) {
            if (typeof typeAlias == 'object') {
               let cfg = Object.assign({}, typeAlias, config, more);
               if (cfg.$type || cfg.type)
                  return this.create(cfg);
            }

            if (typeAlias && this.factory)
               return this.factory(typeAlias, config, more);

            throw new Error(`Unknown component alias ${alias}.`);
         }
      }

      if (Array.isArray(config))
         return config.map(cfg=>this.create(cmpType, cfg, more));

      var cfg = config;

      if (more)
         cfg = Object.assign({}, config, more);

      var cmp = new cmpType(cfg);
      if (!this.lazyInit)
         cmp.init();
      return cmp;
   }
}

Component.isComponentType = true;

Component.prototype.isComponent = true;
Component.namespace = '';
Component.lazyInit = false;

Component.factory = (alias, config, more) => {
   throw new Error(`Unknown component alias ${alias}.`);
};