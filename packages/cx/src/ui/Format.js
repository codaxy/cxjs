import { Culture } from "./Culture";
import { Format as Fmt, resolveMinMaxFractionDigits } from "../util/Format";
import { GlobalCacheIdentifier } from "../util/GlobalCacheIdentifier";

export const Format = Fmt;

let cultureSensitiveFormatsRegistered = false;

export function resolveNumberFormattingFlags(flags) {
   if (!flags) return null;
   let result = {};
   if (flags.indexOf("+") >= 0) result.signDisplay = "exceptZero";
   if (flags.indexOf("c") >= 0) result.notation = "compact";
   if (flags.indexOf("a") >= 0) result.currencySign = "accounting";
   return result;
}

export function enableCultureSensitiveFormatting() {
   if (cultureSensitiveFormatsRegistered) return;

   cultureSensitiveFormatsRegistered = true;

   Fmt.registerFactory(["number", "n"], (format, minimumFractionDigits, maximumFractionDigits, flags) => {
      let culture = Culture.getNumberCulture();

      let formatter = culture.getFormatter({
         ...resolveMinMaxFractionDigits(minimumFractionDigits, maximumFractionDigits),
         ...resolveNumberFormattingFlags(flags),
      });

      return (value) => formatter.format(value);
   });

   Fmt.registerFactory("currency", (format, currency, minimumFractionDigits, maximumFractionDigits, flags) => {
      let culture = Culture.getNumberCulture();
      currency = currency || Culture.defaultCurrency;

      let formatter = culture.getFormatter({
         style: "currency",
         currency: currency,
         ...resolveMinMaxFractionDigits(minimumFractionDigits, maximumFractionDigits),
         ...resolveNumberFormattingFlags(flags),
      });

      return (value) => formatter.format(value);
   });

   Fmt.registerFactory(["percentage", "p", "%"], (format, minimumFractionDigits, maximumFractionDigits, flags) => {
      let culture = Culture.getNumberCulture();
      let formatter = culture.getFormatter({
         style: "percent",
         ...resolveMinMaxFractionDigits(minimumFractionDigits, maximumFractionDigits),
         ...resolveNumberFormattingFlags(flags),
      });
      return (value) => formatter.format(value);
   });

   Fmt.registerFactory(["percentSign", "ps"], (format, minimumFractionDigits, maximumFractionDigits, flags) => {
      let culture = Culture.getNumberCulture();
      let formatter = culture.getFormatter({
         style: "percent",
         ...resolveMinMaxFractionDigits(minimumFractionDigits, maximumFractionDigits),
         ...resolveNumberFormattingFlags(flags),
      });
      return (value) => formatter.format(value / 100);
   });

   Fmt.registerFactory(["date", "d"], (fmt, format = "yyyyMMdd") => {
      let culture = Culture.getDateTimeCulture();
      let formatter = culture.getFormatter(format);
      return (value) => formatter.format(new Date(value));
   });

   Fmt.registerFactory(["time", "t"], (fmt, format = "hhmmss") => {
      let culture = Culture.getDateTimeCulture();
      let formatter = culture.getFormatter(format);
      return (value) => formatter.format(new Date(value));
   });

   Fmt.registerFactory(["datetime", "dt"], (fmt, format = "yyyyMd hhmm") => {
      let culture = Culture.getDateTimeCulture();
      let formatter = culture.getFormatter(format);
      return (value) => formatter.format(new Date(value));
   });

   GlobalCacheIdentifier.change();
}
