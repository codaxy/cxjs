var cssHelperCache = {};

export class CSSHelper {
   static get(code) {
      var helper = cssHelperCache[code];
      if (!helper)
         throw new Error(`Unknown CSS helper '${code}'.`);
      return helper;
   }

   static register(code, helper) {
      cssHelperCache[code] = helper;
   }

   static alias(code, helper) {
      cssHelperCache[code] = helper;
   }
}