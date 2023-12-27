import * as Cx from "../core";
//import {NumberCulture, DateTimeCulture} from 'intl-io';

declare type DateEncoding = (date: Date) => any;

export class Culture {
   static setCulture(cultureCode: string): void;

   static setDefaultCurrency(currencyCode: string): void;

   static readonly defaultCurrency: string;

   static readonly culture: string;

   static setNumberCulture(cultureCode: string): void;

   static getNumberCulture(): any;

   static setDateTimeCulture(cultureCode: string): void;

   static getDateTimeCulture(): any;

   static getDefaultDateEncoding(): DateEncoding;

   static setDefaultDateEncoding(encoding: DateEncoding): void;
}
