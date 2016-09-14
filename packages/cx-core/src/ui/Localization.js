var contents = {};
var localizations = {};

export class Localization {
   static register(key) {
      return type => {
         contents[key] = type.prototype;
         return type;
      }
   }

   static registerPrototype(key, type) {
      contents[key] = type.prototype;
   }

   static localize(culture, key, values) {
      var l = localizations[culture];
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


