import { NumberCulture, DateTimeCulture } from "intl-io";
import { Localization } from "./Localization";
import { GlobalCacheIdentifier } from "../util/GlobalCacheIdentifier";
import { invalidateExpressionCache } from "../data/Expression";
import { invalidateStringTemplateCache } from "../data/StringTemplate";
import { defaultCompare } from "../data/defaultCompare";
import { Console } from "../util/Console";

let stack = [
   {
      culture: "en",
      numberCulture: null,
      dateTimeCulture: null,
      cache: {},
      defaultCurrency: "USD",
      dateEncoding: (date) => date.toISOString(),
      timezone: null,
   },
];

export function getDefaultCulture() {
   return stack[0];
}

export function getCurrentCulture() {
   return stack[stack.length - 1];
}

export function getCurrentCultureCache() {
   return getCurrentCulture().cache;
}

export function pushCulture(cultureInfo) {
   stack.push(cultureInfo);
}

export function createCulture(cultureSpecs) {
   let current = getCurrentCulture();
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

export function popCulture(cultureSpecs) {
   if (stack.length == 1) throw new Error("Cannot pop the last culture object.");
   if (cultureSpecs && stack[stack.length - 1] !== cultureSpecs) {
      Console.warn("Popped culture object does not match the current one.");
   }
   return stack.pop();
}

export class Culture {
   static setCulture(cultureCode) {
      let cultureSpecs = getDefaultCulture();
      cultureSpecs.culture = cultureCode;
      cultureSpecs.cache = {};
      Localization.setCulture(cultureCode);
      this.invalidateCache();
   }

   static setNumberCulture(cultureCode) {
      let cultureSpecs = getDefaultCulture();
      cultureSpecs.numberCulture = cultureCode;
      delete cultureSpecs.cache.numberCulture;
      this.invalidateCache();
   }

   static setDateTimeCulture(cultureCode) {
      let cultureSpecs = getDefaultCulture();
      cultureSpecs.dateTimeCulture = cultureCode;
      delete cultureSpecs.cache.dateTimeCulture;
      this.invalidateCache();
   }

   static setDefaultCurrency(currencyCode) {
      let cultureSpecs = getDefaultCulture();
      cultureSpecs.defaultCurrency = currencyCode;
      this.invalidateCache();
   }

   static setDefaultTimezone(timezone) {
      let cultureSpecs = getDefaultCulture();
      cultureSpecs.timezone = timezone;
      this.invalidateCache();
   }

   static setDefaultDateEncoding(encoding) {
      let cultureSpecs = getDefaultCulture();
      cultureSpecs.dateEncoding = encoding;
      this.invalidateCache();
   }

   static invalidateCache() {
      GlobalCacheIdentifier.change();
      invalidateExpressionCache();
      invalidateStringTemplateCache();
   }

   static get defaultCurrency() {
      return getCurrentCulture().defaultCurrency;
   }

   static get culture() {
      return getCurrentCulture().culture;
   }

   static getNumberCulture() {
      let { cache, numberCulture, culture } = getCurrentCulture();
      if (!cache.numberCulture) cache.numberCulture = new NumberCulture(numberCulture ?? culture);
      return cache.numberCulture;
   }

   static getDateTimeCulture() {
      let { cache, dateTimeCulture, culture, timezone } = getCurrentCulture();
      if (!cache.dateTimeCulture)
         cache.dateTimeCulture = new DateTimeCulture(dateTimeCulture ?? culture, {
            defaultTimezone: timezone,
         });
      return cache.dateTimeCulture;
   }

   static getDefaultDateEncoding() {
      return getCurrentCulture().dateEncoding;
   }

   static getComparer(options) {
      let { culture } = getCurrentCulture();
      if (typeof Intl.Collator != "undefined") return new Intl.Collator(culture, options).compare;
      return defaultCompare;
   }
}
