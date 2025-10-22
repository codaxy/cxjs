var cssHelperCache: { [key: string]: any } = {};

export class CSSHelper {
   static get(code: string): any {
      var helper = cssHelperCache[code];
      if (!helper) throw new Error(`Unknown CSS helper '${code}'.`);
      return helper;
   }

   static register(code: string, helper: any): void {
      cssHelperCache[code] = helper;
   }

   static alias(code: string, helper: any): void {
      cssHelperCache[code] = helper;
   }
}
