import {Culture} from "./Culture";
import {Format as Fmt} from "../util/Format";

function resolveMinMaxFractionDigits(minimumFractionDigits, maximumFractionDigits) {
   minimumFractionDigits = minimumFractionDigits != null ? Number(minimumFractionDigits) : minimumFractionDigits;
   maximumFractionDigits = maximumFractionDigits != null ? Number(maximumFractionDigits) : maximumFractionDigits;

   if (typeof minimumFractionDigits == 'number') {
      if (typeof maximumFractionDigits == 'undefined')
         maximumFractionDigits = minimumFractionDigits;
      else if (typeof maximumFractionDigits == 'number' && maximumFractionDigits < minimumFractionDigits)
         maximumFractionDigits = minimumFractionDigits;
   }
   else if (minimumFractionDigits == null && maximumFractionDigits == null) {
      minimumFractionDigits = 0;
      maximumFractionDigits = 18;
   }

   return {
      minimumFractionDigits,
      maximumFractionDigits
   }
}

export const Format = Fmt;

export function enableCultureSensitiveFormatting() {
   Fmt.registerFactory(
      ['number', 'n'],
      (format, minimumFractionDigits, maximumFractionDigits) => {
         let culture = Culture.getNumberCulture();

         let formatter = culture.getFormatter(resolveMinMaxFractionDigits(minimumFractionDigits, maximumFractionDigits));

         return value => formatter.format(value);
      }
   );

   Fmt.registerFactory('currency',
      (format, currency, minimumFractionDigits, maximumFractionDigits) => {
         let culture = Culture.getNumberCulture();
         currency = currency || Culture.defaultCurrency;

         let formatter = culture.getFormatter({
            style: 'currency',
            currency: currency,
            ...resolveMinMaxFractionDigits(minimumFractionDigits, maximumFractionDigits)
         });

         return value => formatter.format(value);
      }
   );

   Fmt.registerFactory(
      ['percentage', 'p', '%'],
      (format, minimumFractionDigits, maximumFractionDigits) => {
         let culture = Culture.getNumberCulture();
         let formatter = culture.getFormatter({
            style: 'percent',
            ...resolveMinMaxFractionDigits(minimumFractionDigits, maximumFractionDigits)
         });
         return value => formatter.format(value);
      }
   );

   Fmt.registerFactory(
      ['percentSign', 'ps'],
      (format, minimumFractionDigits, maximumFractionDigits) => {
         let culture = Culture.getNumberCulture();
         let formatter = culture.getFormatter({
            style: 'percent',
            ...resolveMinMaxFractionDigits(minimumFractionDigits, maximumFractionDigits)
         });
         return value => formatter.format(value / 100);
      }
   );

   Fmt.registerFactory(['date', 'd'], () => {
      let culture = Culture.getDateTimeCulture();
      let formatter = culture.getFormatter();
      return value => formatter.format(new Date(value));
   });


   Fmt.registerFactory(['time', 't'], () => {
      let culture = Culture.getDateTimeCulture();
      let formatter = culture.getFormatter({
         hour: 'numeric',
         minute: 'numeric',
         second: 'numeric'
      });
      return value => formatter.format(new Date(value));
   });

   Fmt.registerFactory(
      ['datetime', 'dt'],
      (fmt, format = 'yyyyMd hhmm') => {
         let culture = Culture.getDateTimeCulture();
         let formatter = culture.getFormatter(format);
         return value => formatter.format(new Date(value));
      }
   );
}