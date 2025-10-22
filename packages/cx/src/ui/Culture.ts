import { NumberCulture, DateTimeCulture } from "intl-io";
import { Localization } from "./Localization";
import { GlobalCacheIdentifier } from "../util/GlobalCacheIdentifier";
import { invalidateExpressionCache } from "../data/Expression";
import { invalidateStringTemplateCache } from "../data/StringTemplate";
import { defaultCompare } from "../data/defaultCompare";
import { Console } from "../util/Console";

export interface CultureInfo {
   culture?: string;
   numberCulture?: string | null;
   dateTimeCulture?: string | null;
   cache?: any;
   defaultCurrency?: string;
   dateEncoding?: (date: Date) => string;
   timezone?: string | null;
}

let stack: CultureInfo[] = [
   {
      culture: "en",
      numberCulture: null,
      dateTimeCulture: null,
      cache: {},
      defaultCurrency: "USD",
      dateEncoding: (date: Date) => date.toISOString(),
      timezone: null,
   },
];

export function getDefaultCulture(): CultureInfo {
   return stack[0];
}

export function getCurrentCulture(): CultureInfo {
   return stack[stack.length - 1];
}

export function getCurrentCultureCache(): any {
   return getCurrentCulture().cache;
}

export function pushCulture(cultureInfo: CultureInfo): void {
   stack.push(cultureInfo);
}

export function createCulture(cultureSpecs: Partial<CultureInfo>): CultureInfo {
   let current = getCurrentCulture();
   let info: CultureInfo = {
      culture: current.culture,
      dateEncoding: current.dateEncoding,
      defaultCurrency: current.defaultCurrency,
      cache: {},
   };
   for (let key in cultureSpecs) {
      if (!(cultureSpecs as any)[key]) continue;
      (info as any)[key] = (cultureSpecs as any)[key];
   }
   return info;
}

export function popCulture(cultureSpecs?: CultureInfo): CultureInfo | undefined {
   if (stack.length == 1) throw new Error("Cannot pop the last culture object.");
   if (cultureSpecs && stack[stack.length - 1] !== cultureSpecs) {
      Console.warn("Popped culture object does not match the current one.");
   }
   return stack.pop();
}

export class Culture {
   static setCulture(cultureCode: string): void {
      let cultureSpecs = getDefaultCulture();
      cultureSpecs.culture = cultureCode;
      cultureSpecs.cache = {};
      Localization.setCulture(cultureCode);
      this.invalidateCache();
   }

   static setNumberCulture(cultureCode: string): void {
      let cultureSpecs = getDefaultCulture();
      cultureSpecs.numberCulture = cultureCode;
      delete cultureSpecs.cache.numberCulture;
      this.invalidateCache();
   }

   static setDateTimeCulture(cultureCode: string): void {
      let cultureSpecs = getDefaultCulture();
      cultureSpecs.dateTimeCulture = cultureCode;
      delete cultureSpecs.cache.dateTimeCulture;
      this.invalidateCache();
   }

   static setDefaultCurrency(currencyCode: string): void {
      let cultureSpecs = getDefaultCulture();
      cultureSpecs.defaultCurrency = currencyCode;
      this.invalidateCache();
   }

   static setDefaultTimezone(timezone: string): void {
      let cultureSpecs = getDefaultCulture();
      cultureSpecs.timezone = timezone;
      this.invalidateCache();
   }

   static setDefaultDateEncoding(encoding: (date: Date) => string): void {
      let cultureSpecs = getDefaultCulture();
      cultureSpecs.dateEncoding = encoding;
      this.invalidateCache();
   }

   static invalidateCache(): void {
      GlobalCacheIdentifier.change();
      invalidateExpressionCache();
      invalidateStringTemplateCache();
   }

   static get defaultCurrency(): string | undefined {
      return getCurrentCulture().defaultCurrency;
   }

   static get culture(): string | undefined {
      return getCurrentCulture().culture;
   }

   static getNumberCulture(): NumberCulture {
      let { cache, numberCulture, culture } = getCurrentCulture();
      if (!cache!.numberCulture) cache!.numberCulture = new NumberCulture(numberCulture ?? culture);
      return cache!.numberCulture;
   }

   static getDateTimeCulture(): DateTimeCulture {
      let { cache, dateTimeCulture, culture, timezone } = getCurrentCulture();
      if (!cache!.dateTimeCulture)
         cache!.dateTimeCulture = new DateTimeCulture(dateTimeCulture ?? culture, {
            defaultTimezone: timezone,
         });
      return cache!.dateTimeCulture;
   }

   static getDefaultDateEncoding(): ((date: Date) => string) | undefined {
      return getCurrentCulture().dateEncoding;
   }

   static getComparer(options?: Intl.CollatorOptions): ((a: any, b: any) => number) {
      let { culture } = getCurrentCulture();
      if (typeof Intl.Collator != "undefined") return new Intl.Collator(culture, options).compare;
      return defaultCompare;
   }
}
