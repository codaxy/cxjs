import { NumberCulture, DateTimeCulture } from "intl-io";
import { Localization } from "./Localization";
import { GlobalCacheIdentifier } from "../util/GlobalCacheIdentifier";
import { invalidateExpressionCache } from "../data/Expression";
import { invalidateStringTemplateCache } from "../data/StringTemplate";
import { defaultCompare } from "../data/defaultCompare";

// let culture = "en";
// let numberCulture = null;
// let dateTimeCulture = null;
// let cache = {};
// let defaultCurrency = "USD";
// let dateEncoding = (date) => date.toISOString();

let stack = [
   {
      culture: "en",
      numberCulture: null,
      dateTimeCulture: null,
      cache: {},
      defaultCurrency: "USD",
      dateEncoding: (date) => date.toISOString(),
   },
];

function getRootCultureSpecs() {
   return stack[0];
}

function getCurrentCultureSpecs() {
   return stack[stack.length - 1];
}

export function getCurrentCultureCache() {
   return getCurrentCultureSpecs().cache;
}

export function pushCulture(cultureInfo) {
   stack.push(cultureInfo);
}

export function createCulture(cultureSpecs) {
   let current = getCurrentCultureSpecs();
   let info = {
      culture: current.culture,
      dateEncoding: current.dateEncoding,
      defaultCurrency: current.defaultCurrency,
      cache: {},
   };
   for (let key in cultureSpecs) {
      if (!cultureSpecs[key]) continue;
      info[key] = cultureSpecs[key];
   }
   return info;
}

export function popCulture() {
   if (stack.length == 1) throw new Error("Cannot pop the last culture object.");
   return stack.pop();
}

export class Culture {
   static setCulture(cultureCode) {
      let cultureSpecs = getRootCultureSpecs();
      cultureSpecs.culture = cultureCode;
      cultureSpecs.cache = {};
      Localization.setCulture(cultureCode);
      this.invalidateCache();
   }

   static setNumberCulture(cultureCode) {
      let cultureSpecs = getRootCultureSpecs();
      cultureSpecs.numberCulture = cultureCode;
      delete cultureSpecs.cache.numberCulture;
      this.invalidateCache();
   }

   static setDateTimeCulture(cultureCode) {
      let cultureSpecs = getRootCultureSpecs();
      cultureSpecs.dateTimeCulture = cultureCode;
      delete cultureSpecs.cache.dateTimeCulture;
      this.invalidateCache();
   }

   static setDefaultCurrency(currencyCode) {
      let cultureSpecs = getRootCultureSpecs();
      cultureSpecs.defaultCurrency = currencyCode;
      this.invalidateCache();
   }

   static setDefaultDateEncoding(encoding) {
      let cultureSpecs = getRootCultureSpecs();
      cultureSpecs.dateEncoding = encoding;
      this.invalidateCache();
   }

   static invalidateCache() {
      GlobalCacheIdentifier.change();
      invalidateExpressionCache();
      invalidateStringTemplateCache();
   }

   static get defaultCurrency() {
      return getCurrentCultureSpecs().defaultCurrency;
   }

   static get culture() {
      return getCurrentCultureSpecs().culture;
   }

   static getNumberCulture() {
      let { cache, numberCulture, culture } = getCurrentCultureSpecs();
      if (!cache.numberCulture) cache.numberCulture = new NumberCulture(numberCulture ?? culture);
      return cache.numberCulture;
   }

   static getDateTimeCulture() {
      let { cache, dateTimeCulture, culture } = getCurrentCultureSpecs();
      if (!cache.dateTimeCulture) cache.dateTimeCulture = new DateTimeCulture(dateTimeCulture ?? culture);
      return cache.dateTimeCulture;
   }

   static getDefaultDateEncoding() {
      return getCurrentCultureSpecs().dateEncoding;
   }

   static getComparer(options) {
      let { culture } = getCurrentCultureSpecs();
      if (typeof Intl.Collator != "undefined") return new Intl.Collator(culture, options).compare;
      return defaultCompare;
   }
}
