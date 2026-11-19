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

// Builds a number formatter from Intl options and format flags. Values that round to zero at the
// displayed precision count as zero: the `z` flag shows them as null text, and the `a` flag shows them
// without a sign. Intl applies `currencySign: "accounting"` only to currencies, so other styles
// get parentheses here.
function getNumberFormatter(options: Intl.NumberFormatOptions, flags?: string): (value: number) => string | null {
   let culture = Culture.getNumberCulture();
   let flagOptions = resolveNumberFormattingFlags(flags);
   let formatter = culture.getFormatter({ ...options, ...flagOptions });
   let accounting = flags != null && flags.indexOf("a") >= 0;
   let zeroAsNull = flags != null && flags.indexOf("z") >= 0;

   if (!accounting && !zeroAsNull) return (value) => formatter.format(value);

   // Compact notation applies the fraction digits to the shortened value, so only exact zero counts there.
   let zeroLimit = Number.MIN_VALUE;
   let { maximumFractionDigits } = options;
   if (flagOptions?.notation != "compact" && maximumFractionDigits != null && maximumFractionDigits >= 0) {
      // percentages are multiplied by 100 before rounding
      zeroLimit = 5 / 10 ** (maximumFractionDigits + (options.style == "percent" ? 3 : 1));
   }

   let negativeLimit = -zeroLimit;

   // Intl puts currencies in parentheses itself
   if (!accounting || options.style == "currency") {
      if (zeroAsNull) return (value) => (value < zeroLimit && value > negativeLimit ? null : formatter.format(value));
      return (value) => formatter.format(value < zeroLimit && value > negativeLimit ? 0 : value);
   }

   let negativeFormatter = culture.getFormatter({ ...options, ...flagOptions, signDisplay: "never" });

   if (zeroAsNull)
      return (value) =>
         value <= negativeLimit
            ? "(" + negativeFormatter.format(value) + ")"
            : value < zeroLimit
              ? null
              : formatter.format(value);

   return (value) =>
      value <= negativeLimit
         ? "(" + negativeFormatter.format(value) + ")"
         : formatter.format(value < zeroLimit ? 0 : value);
}

export function enableCultureSensitiveFormatting() {
   if (cultureSensitiveFormatsRegistered) return;

   cultureSensitiveFormatsRegistered = true;

   Fmt.registerFactory(
      ["number", "n"],
      (format: any, minimumFractionDigits?: any, maximumFractionDigits?: any, flags?: string) =>
         getNumberFormatter(resolveMinMaxFractionDigits(minimumFractionDigits, maximumFractionDigits), flags),
   );

   Fmt.registerFactory(
      "currency",
      (format: any, currency?: string, minimumFractionDigits?: any, maximumFractionDigits?: any, flags?: string) =>
         getNumberFormatter(
            {
               style: "currency",
               currency: currency || Culture.defaultCurrency,
               ...resolveMinMaxFractionDigits(minimumFractionDigits, maximumFractionDigits),
            },
            flags,
         ),
   );

   Fmt.registerFactory(
      ["percentage", "p", "%"],
      (format: any, minimumFractionDigits?: any, maximumFractionDigits?: any, flags?: string) =>
         getNumberFormatter(
            { style: "percent", ...resolveMinMaxFractionDigits(minimumFractionDigits, maximumFractionDigits) },
            flags,
         ),
   );

   Fmt.registerFactory(
      ["percentSign", "ps"],
      (format: any, minimumFractionDigits?: any, maximumFractionDigits?: any, flags?: string) => {
         let formatter = getNumberFormatter(
            { style: "percent", ...resolveMinMaxFractionDigits(minimumFractionDigits, maximumFractionDigits) },
            flags,
         );
         return (value: any) => formatter(value / 100);
      },
   );

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
