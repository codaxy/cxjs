import {Console} from "./Console";
import {GlobalCacheIdentifier} from './GlobalCacheIdentifier';

//Culture dependent formatters are defined in the ui package.

const defaultFormatter = v => v.toString();

var formatFactory = {

   string: function() {
      return defaultFormatter
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

formatFactory.s = formatFactory.str = formatFactory.string;

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
            var outerFmt = factory(...parts);
            var innerFmt = formatter;
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
      this.registerFactory(format, () => formatter);
   }

   static registerFactory(format, factory) {
      if (Array.isArray(format))
         format.forEach(f => this.registerFactory(f, factory));
      else
         formatFactory[format] = factory;
   }
}
