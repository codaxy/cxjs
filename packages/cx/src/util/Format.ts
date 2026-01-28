import { debug } from "./Debug";
import { GlobalCacheIdentifier } from "./GlobalCacheIdentifier";
import { isNumber } from "../util/isNumber";
import { isUndefined } from "../util/isUndefined";
import { isArray } from "../util/isArray";
import { capitalize } from "./capitalize";
import { parseDateInvariant } from "./date/parseDateInvariant";

//Culture dependent formatters are defined in the ui package.

type Formatter = (value: any) => string;

const defaultFormatter: Formatter = (v) => v.toString();

let formatFactory: Record<string, (...args: any[]) => (value: any) => string> = {
   string: function () {
      return defaultFormatter;
   },

   wrap: function (part0, prefix, suffix) {
      if (!prefix) prefix = "";

      if (!suffix) suffix = "";

      return (value: any) => prefix + String(value) + suffix;
   },

   fixed: function (part0, digits) {
      return (value: any) => Number(value).toFixed(digits);
   },

   prefix: function (part0, prefix) {
      if (!prefix) prefix = "";

      return (value: any) => prefix + String(value);
   },

   suffix: function (part0, suffix) {
      if (!suffix) suffix = "";

      return (value: any) => String(value) + suffix;
   },

   uppercase: function () {
      return (value: any) => String(value).toUpperCase();
   },

   lowercase: function () {
      return (value: any) => String(value).toLowerCase();
   },

   urlencode: function () {
      return (value: any) => encodeURIComponent(value);
   },

   number: function (part0, minFractionDigits, maxFractionDigits) {
      let { minimumFractionDigits, maximumFractionDigits } = resolveMinMaxFractionDigits(
         minFractionDigits,
         maxFractionDigits,
      );
      let trimmable = maximumFractionDigits - minimumFractionDigits;
      if (trimmable > 0) {
         if (minimumFractionDigits == 0) ++trimmable;
         return (value: any) => trimFractionZeros(value.toFixed(maximumFractionDigits), trimmable);
      }
      return (value: any) => value.toFixed(maximumFractionDigits);
   },

   percentage: function (part0, minFractionDigits, maxFractionDigits) {
      let numberFormatter = formatFactory.number(part0, minFractionDigits, maxFractionDigits);
      return (value: any) => numberFormatter(value * 100) + "%";
   },

   percentageSign: function (part0, minFractionDigits, maxFractionDigits) {
      let numberFormatter = formatFactory.number(part0, minFractionDigits, maxFractionDigits);
      return (value: any) => numberFormatter(value) + "%";
   },

   date: function () {
      return (value: any) => {
         let date = parseDateInvariant(value);
         return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
      };
   },

   time: function () {
      return (value: any) => {
         let date = parseDateInvariant(value);
         let h = date.getHours() >= 10 ? date.getHours() : "0" + date.getHours();
         let m = date.getMinutes() >= 10 ? date.getMinutes() : "0" + date.getMinutes();
         return `${h}:${m}`;
      };
   },

   datetime: function () {
      let date = formatFactory.date();
      let time = formatFactory.time();
      return (value: any) => date(value) + " " + time(value);
   },

   ellipsis: function (part0, length, where) {
      length = Number(length);
      if (!(length > 3)) length = 10;
      switch (where) {
         default:
         case "end":
            return (value) => {
               let s = String(value);
               if (s.length > length) return s.substring(0, length - 3) + "...";
               return s;
            };

         case "start":
            return (value) => {
               let s = String(value);
               if (s.length > length) return "..." + s.substring(s.length - length + 3);
               return s;
            };

         case "middle":
            return (value) => {
               let s = String(value);
               if (s.length > length) {
                  let x = Math.floor(length - 2) / 2;
                  return s.substring(0, x) + "..." + s.substring(s.length - (length - 3 - x));
               }
               return s;
            };
      }
   },

   zeroPad: function (part0, length) {
      return (value: any) => {
         let s = String(value);
         return s.padStart(length, "0");
      };
   },

   leftPad: function (part0, length, char) {
      return (value: any) => {
         let s = String(value);
         return s.padStart(length, char ?? " ");
      };
   },

   capitalize: function () {
      return (value) => {
         let s = String(value);
         return capitalize(s);
      };
   },

   titleCase: function () {
      return (value) => {
         let s = String(value);
         return s.replace(/\w\S*/g, function (word) {
            return capitalize(word.toLowerCase());
         });
      };
   },
};

formatFactory.s = formatFactory.str = formatFactory.string;
formatFactory.f = formatFactory.fixed;
formatFactory.n = formatFactory.number;
formatFactory.p = formatFactory.percentage;
formatFactory.ps = formatFactory.percentageSign;
formatFactory.d = formatFactory.date;
formatFactory.t = formatFactory.time;
formatFactory.dt = formatFactory.datetime;
formatFactory.zeropad = formatFactory.zeroPad;
formatFactory.leftpad = formatFactory.leftPad;
formatFactory.capitalize = formatFactory.capitalize;
formatFactory.titlecase = formatFactory.titleCase;

function buildFormatter(format: string): Formatter {
   let formatter = defaultFormatter,
      nullText = "";
   if (format) {
      let pipeParts = format.split("|");
      nullText = pipeParts[1] || "";
      let colonSepParts = pipeParts[0].split(":");
      for (let i = 0; i < colonSepParts.length; i++) {
         let parts = colonSepParts[i].split(";");
         let factory = formatFactory[parts[0]];
         if (!factory) debug("Unknown string format: " + format);
         else if (i == 0) formatter = factory(...parts);
         else {
            let outerFmt = factory(...parts);
            let innerFmt = formatter;
            formatter = (v) => outerFmt(innerFmt(v));
         }
      }
   }
   return (v) => (v == null || v === "" ? nullText : formatter(v));
}

let format: { cache: Record<string, Formatter>; cacheIdentifier?: number } = { cache: {} };

function getDefaultFormatCache(): Record<string, Formatter> {
   if (format.cacheIdentifier != GlobalCacheIdentifier.get()) {
      format = { cache: {}, cacheIdentifier: GlobalCacheIdentifier.get() };
   }
   return format.cache;
}

let getFormatCache = getDefaultFormatCache;

export function setGetFormatCacheCallback(callback: () => Record<string, Formatter>): void {
   getFormatCache = callback;
}

function getFormatter(format: string): Formatter {
   if (!format) format = "";
   let formatCache = getFormatCache();
   let formatter = formatCache[format];
   if (!formatter) formatter = formatCache[format] = buildFormatter(format);

   return formatter;
}

export class Format {
   static value(v: any, format: string): string {
      let formatter = getFormatter(format);
      return formatter(v);
   }

   static parse(format: string): Formatter {
      return getFormatter(format);
   }

   static register(format: string | string[], formatter: Formatter): void {
      this.registerFactory(format, () => formatter);
   }

   static registerFactory(format: string | string[], factory: (...args: any[]) => Formatter): void {
      if (isArray(format)) format.forEach((f) => this.registerFactory(f, factory));
      else formatFactory[format] = factory;
   }
}

export function resolveMinMaxFractionDigits(
   minimumFractionDigits: number,
   maximumFractionDigits: number,
): { minimumFractionDigits: number; maximumFractionDigits: number } {
   minimumFractionDigits = minimumFractionDigits != null ? Number(minimumFractionDigits) : minimumFractionDigits;
   maximumFractionDigits = maximumFractionDigits != null ? Number(maximumFractionDigits) : maximumFractionDigits;

   if (isNumber(minimumFractionDigits)) {
      if (isUndefined(maximumFractionDigits)) maximumFractionDigits = minimumFractionDigits;
      else if (isNumber(maximumFractionDigits) && maximumFractionDigits < minimumFractionDigits)
         maximumFractionDigits = minimumFractionDigits;
   } else if (minimumFractionDigits == null && maximumFractionDigits == null) {
      minimumFractionDigits = 0;
      maximumFractionDigits = 18;
   }

   return { minimumFractionDigits, maximumFractionDigits };
}

export function trimFractionZeros(str: string, max: number): string {
   let cnt = 0,
      l = str.length;
   while (cnt < max && (str[l - 1 - cnt] === "0" || str[l - 1 - cnt] === ".")) cnt++;

   return cnt > 0 ? str.substring(0, l - cnt) : str;
}
