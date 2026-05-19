import { Culture, getCurrentCultureCache } from "./Culture";
import { Format as Fmt, resolveMinMaxFractionDigits, setGetFormatCacheCallback } from "../util/Format";
import { setGetExpressionCacheCallback } from "../data/Expression";
import { setGetStringTemplateCacheCallback, StringTemplate } from "../data/StringTemplate";
import { dateQuarter, dayBefore, parseDateInvariant } from "../util";
import { GlobalCacheIdentifier } from "../util/GlobalCacheIdentifier";

export const Format = Fmt;

// The `quarter` formatter renders a calendar quarter via a string-template
// pattern with `{q}` (quarter number), `{yyyy}` and `{yy}` (year) placeholders.
// Placeholders are case-insensitive (`{Q}`, `{YYYY}`, `{YY}` work too). It lives
// here rather than in util/Format because it depends on StringTemplate from the
// data layer, which util/ cannot import. It is registered eagerly since it does
// not depend on culture settings.
Fmt.registerFactory("quarter", (fmt: any, pattern?: string, mode?: string) => {
   let exclusive = mode === "exclusive" || mode === "ex" || mode === "e";
   let template = StringTemplate.get(pattern || "Q{q} {yyyy}");
   return (value: any) => {
      let date = parseDateInvariant(value);
      if (exclusive) date = dayBefore(date);
      let q = dateQuarter(date);
      let yyyy = date.getFullYear();
      let yy = String(yyyy % 100).padStart(2, "0");
      return template({ q, Q: q, yyyy, YYYY: yyyy, yy, YY: yy });
   };
});

let cultureSensitiveFormatsRegistered = false;

export function resolveNumberFormattingFlags(flags?: string): any {
   if (!flags) return null;
   let result: any = {};
   if (flags.indexOf("+") >= 0) result.signDisplay = "exceptZero";
   if (flags.indexOf("c") >= 0) result.notation = "compact";
   if (flags.indexOf("a") >= 0) result.currencySign = "accounting";
   return result;
}

export function enableCultureSensitiveFormatting() {
   if (cultureSensitiveFormatsRegistered) return;

   cultureSensitiveFormatsRegistered = true;

   Fmt.registerFactory(["number", "n"], (format: any, minimumFractionDigits?: any, maximumFractionDigits?: any, flags?: string) => {
      let culture = Culture.getNumberCulture();

      let formatter = culture.getFormatter({
         ...resolveMinMaxFractionDigits(minimumFractionDigits, maximumFractionDigits),
         ...resolveNumberFormattingFlags(flags),
      });

      return (value: any) => formatter.format(value);
   });

   Fmt.registerFactory("currency", (format: any, currency?: string, minimumFractionDigits?: any, maximumFractionDigits?: any, flags?: string) => {
      let culture = Culture.getNumberCulture();
      currency = currency || Culture.defaultCurrency;

      let formatter = culture.getFormatter({
         style: "currency",
         currency: currency,
         ...resolveMinMaxFractionDigits(minimumFractionDigits, maximumFractionDigits),
         ...resolveNumberFormattingFlags(flags),
      });

      return (value: any) => formatter.format(value);
   });

   Fmt.registerFactory(["percentage", "p", "%"], (format: any, minimumFractionDigits?: any, maximumFractionDigits?: any, flags?: string) => {
      let culture = Culture.getNumberCulture();
      let formatter = culture.getFormatter({
         style: "percent",
         ...resolveMinMaxFractionDigits(minimumFractionDigits, maximumFractionDigits),
         ...resolveNumberFormattingFlags(flags),
      });
      return (value: any) => formatter.format(value);
   });

   Fmt.registerFactory(["percentSign", "ps"], (format: any, minimumFractionDigits?: any, maximumFractionDigits?: any, flags?: string) => {
      let culture = Culture.getNumberCulture();
      let formatter = culture.getFormatter({
         style: "percent",
         ...resolveMinMaxFractionDigits(minimumFractionDigits, maximumFractionDigits),
         ...resolveNumberFormattingFlags(flags),
      });
      return (value: any) => formatter.format(value / 100);
   });

   Fmt.registerFactory(["date", "d"], (fmt: any, format = "yyyyMMdd") => {
      let culture = Culture.getDateTimeCulture();
      let formatter = culture.getFormatter(format);
      return (value: any) => formatter.format(parseDateInvariant(value));
   });

   Fmt.registerFactory(["time", "t"], (fmt: any, format = "hhmmss") => {
      let culture = Culture.getDateTimeCulture();
      let formatter = culture.getFormatter(format);
      return (value: any) => formatter.format(parseDateInvariant(value));
   });

   Fmt.registerFactory(["datetime", "dt"], (fmt: any, format = "yyyyMd hhmm") => {
      let culture = Culture.getDateTimeCulture();
      let formatter = culture.getFormatter(format);
      return (value: any) => formatter.format(parseDateInvariant(value));
   });

   Fmt.registerFactory(["dayBefore", "daybefore"], (fmt: any, format = "yyyyMd hhmm") => {
      let culture = Culture.getDateTimeCulture();
      let formatter = culture.getFormatter(format);
      return (value: any) => formatter.format(dayBefore(parseDateInvariant(value)));
   });

   setGetFormatCacheCallback(() => {
      let cache = getCurrentCultureCache();
      if (!cache.formatCache) cache.formatCache = {};
      return cache.formatCache;
   });

   setGetExpressionCacheCallback(() => {
      let cache = getCurrentCultureCache();
      if (!cache.exprCache) cache.exprCache = {};
      return cache.exprCache;
   });

   setGetStringTemplateCacheCallback(() => {
      let cache = getCurrentCultureCache();
      if (!cache.strTplCache) cache.strTplCache = {};
      return cache.strTplCache;
   });

   GlobalCacheIdentifier.change();
}
