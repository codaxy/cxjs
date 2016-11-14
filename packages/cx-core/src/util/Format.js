import {Console} from "./Console";
import {Culture} from "../ui/Culture";
import {GlobalCacheIdentifier} from '../util/GlobalCacheIdentifier';

const defaultFormatter = v => v.toString();

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

var formatFactory = {

   string: function() {
      return defaultFormatter
   },

   number: function(format, minimumFractionDigits, maximumFractionDigits) {
      var culture = Culture.getNumberCulture();

      var formatter = culture.getFormatter(resolveMinMaxFractionDigits(minimumFractionDigits, maximumFractionDigits));

      return value => formatter.format(value);
   },

   currency: function(format, currency, minimumFractionDigits, maximumFractionDigits) {
      var culture = Culture.getNumberCulture();
      currency = currency || Culture.defaultCurrency;

      var formatter = culture.getFormatter({
         style: 'currency',
         currency: currency,
         ...resolveMinMaxFractionDigits(minimumFractionDigits, maximumFractionDigits)
      });

      return value => formatter.format(value);
   },

   percentage: function(format, minimumFractionDigits, maximumFractionDigits) {
      var culture = Culture.getNumberCulture();
      var formatter = culture.getFormatter({
         style: 'percent',
         ...resolveMinMaxFractionDigits(minimumFractionDigits, maximumFractionDigits)
      });
      return value => formatter.format(value);
   },

   percentSign: function(format, minimumFractionDigits, maximumFractionDigits) {
      var culture = Culture.getNumberCulture();
      var formatter = culture.getFormatter({
         style: 'percent',
         ...resolveMinMaxFractionDigits(minimumFractionDigits, maximumFractionDigits)
      });
      return value => formatter.format(value / 100);
   },

   date: function() {
      var culture = Culture.getDateTimeCulture();
      var formatter = culture.getFormatter();
      return value => formatter.format(new Date(value));
   },

   time: function() {
      var culture = Culture.getDateTimeCulture();
      var formatter = culture.getFormatter({
         hour: 'numeric',
         minute: 'numeric',
         second: 'numeric'
      });
      return value => formatter.format(new Date(value));
   },

   datetime: function(fmt, format = 'yyyyMd hhmm') {
      var culture = Culture.getDateTimeCulture();
      var formatter = culture.getFormatter(format);
      return value => formatter.format(new Date(value));
   },

   wrap: function(part0, prefix, suffix) {
      if (!prefix)
         prefix = '';

      if (!suffix)
         suffix = '';

      return value => prefix + value.toString() + suffix;
   },

   prefix: function(part0, prefix) {
      if (!prefix)
         prefix = '';

      return value => prefix + value.toString();
   },

   suffix: function(part0, suffix) {
      if (!suffix)
         suffix = '';

      return value => value.toString() + suffix;
   },

   uppercase: function() {
      return value => value.toString().toUpperCase();
   },

   lowercase: function() {
      return value => value.toString().toLowerCase();
   },

   urlencode: function() {
      return value => encodeURIComponent(value);
   }
};

formatFactory.d = formatFactory.date;
formatFactory.dt = formatFactory.datetime;
formatFactory.t = formatFactory.time;
formatFactory.s = formatFactory.str = formatFactory.string;
formatFactory.n = formatFactory.number;
formatFactory.p = formatFactory['%'] = formatFactory.percentage;
formatFactory.ps = formatFactory.percentSign;

function buildFormatter(format) {
   var formatter = defaultFormatter;
   if (format) {
      var pipeParts = format.split('|');
      var nullText = pipeParts[1] || '';
      var colonSepParts = pipeParts[0].split(':');
      for (var i = 0; i < colonSepParts.length; i++) {
         var parts = colonSepParts[i].split(';');
         var factory = formatFactory[parts[0]];
         if (!factory)
            Console.log('Unknown string format: ' + format);
         else if (i == 0)
            formatter = factory(...parts);
         else {
            let outerFmt = factory(...parts);
            let innerFmt = formatter;
            formatter = v => outerFmt(innerFmt(v));
         }
      }
   }
   return v => (v == null || v === '') ? nullText : formatter(v);
}

var format = {
   cache: {},
};

function getFormatCache() {
   if (format.cacheIdentifier != GlobalCacheIdentifier.get()) {
      format = {
         cache: {},
         cacheIdentifier: GlobalCacheIdentifier.get()
      };
   }
   return format.cache;
}

function getFormatter(format) {
   if (!format)
      format = '';
   var formatCache = getFormatCache();
   var formatter = formatCache[format];
   if (!formatter)
      formatter = formatCache[format] = buildFormatter(format);

   return formatter;
}

export class Format {

   static value(v, format) {
      var formatter = getFormatter(format);
      return formatter(v);
   }

   static parse(format) {
      return getFormatter(format);
   }

   static register(format, formatter) {
      formatFactory[format] = () => formatter;
   }

   static registerFactory(format, factory) {
      formatFactory[format] = factory;
   }
}
