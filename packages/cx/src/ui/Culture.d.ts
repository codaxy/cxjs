import * as Cx from '../core';

export class Culture {
   static setCulture(cultureCode: string);

   static setDefaultCurrency(currencyCode: string);

   readonly defaultCurrency: string;

   readonly culture: string;

   static getNumberCulture(): any;

   static getDateTimeCulture(): any;
}
