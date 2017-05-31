let contents = {};
let localizations = {};
let overrides = {};
let defaults = {};
let trackDefaults = false;

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
         this.override(key, overrides[key]);
   }

   static trackDefaults() {
      trackDefaults = true;
   }

   static restoreDefaults() {
      for (let type in defaults) {
         let proto = contents[type];
         if (!proto)
            continue;
         let d = defaults[type];
         for (let key in d)
            proto[key] = d[key];
      }
      defaults = {};
   }

   static override(key, values) {
      overrides[key] = values;
      let p = contents[key];
      if (p) {
         if (trackDefaults && !defaults[key]) {
            let d = defaults[key] = {};
            for (let key in values)
               d[key] = p[key];
         }
         Object.assign(p, values);
      }
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


