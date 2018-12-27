import {NumberCulture, DateTimeCulture} from 'intl-io';
import {Localization} from './Localization';
import {GlobalCacheIdentifier} from '../util/GlobalCacheIdentifier';
import {invalidateExpressionCache} from "../data/Expression";
import {invalidateStringTemplateCache} from "../data/StringTemplate";

let culture = 'en';
let cultureCache = {};
let defaultCurrency = 'USD';
let dateEncoding = date => date.toISOString();

export class Culture {
   static setCulture(cultureCode) {
      culture = cultureCode;
      cultureCache = {};
      Localization.setCulture(cultureCode);
      this.invalidateCache();
   }

   static setDefaultCurrency(currencyCode) {
      defaultCurrency = currencyCode;
      this.invalidateCache();
   }

   static invalidateCache() {
      GlobalCacheIdentifier.change();
      invalidateExpressionCache();
      invalidateStringTemplateCache();
   }

   static get defaultCurrency() {
      return defaultCurrency
   };

   static get culture() {
      return culture;
   }

   static getNumberCulture() {
      if (!cultureCache.numberCulture)
         cultureCache.numberCulture = new NumberCulture(culture);
      return cultureCache.numberCulture;
   }

   static getDateTimeCulture() {
      if (!cultureCache.dateCulture)
         cultureCache.dateCulture = new DateTimeCulture(culture);
      return cultureCache.dateCulture;
   }

   static getDefaultDateEncoding() {
      return dateEncoding;
   }

   static setDefaultDateEncoding(encoding) {
      dateEncoding = encoding;
   }
}
