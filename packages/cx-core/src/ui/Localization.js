let contents = {};
let localizations = {};
let overrides = {};

export class Localization {
   static register(key) {
      return type => {
         this.registerPrototype(key, type);
         return type;
      }
   }

   static registerPrototype(key, type) {
      contents[key] = type.prototype;
      if (overrides[key])
         Object.assign(type.prototype, overrides[key]);
   }

   static override(key, values) {
      overrides[key] = values;
      let p = contents[key];
      if (p)
         Object.assign(p, values);
   }

   static localize(culture, key, values) {
      let l = localizations[culture];
      if (!l)
         l = localizations[culture] = {};
      l[key] = {
         ...l[key],
         ...values
      };
   }

   static setCulture(culture) {
      var l = localizations[culture];
      if (l) {
         for (var key in l) {
            var content = contents[key];
            if (content)
               Object.assign(content, l[key]);
         }
      }
   }
}


