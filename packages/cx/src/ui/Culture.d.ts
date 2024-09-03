declare type DateEncoding = (date: Date) => any;

export class Culture {
   static setCulture(cultureCode: string): void;

   static setDefaultCurrency(currencyCode: string): void;

   static setDefaultTimezone(timezone: string): void;

   static readonly defaultCurrency: string;

   static readonly culture: string;

   static setNumberCulture(cultureCode: string): void;

   static getNumberCulture(): any;

   static setDateTimeCulture(cultureCode: string): void;

   static getDateTimeCulture(): any;

   static getDefaultDateEncoding(): DateEncoding;

   static setDefaultDateEncoding(encoding: DateEncoding): void;
}

export interface CultureSpecs {
   culture?: string;
   numberCulture?: string;
   dateTimeCulture?: string;
   defaultCurrency?: string;
   dateEncoding?: DateEncoding;
   timezone?: string;
}

export interface CultureInfo {
   culture: string;
   numberCulture?: string;
   dateTimeCulture?: string;
   defaultCurrency: string;
   dateEncoding: DateEncoding;
   timezone?: string;
}

export function createCulture(cultureSpecs: CultureSpecs): CultureInfo;

export function pushCulture(cultureSpecs: CultureInfo): void;

export function popCulture(cultureSpecs?: CultureInfo): CultureInfo;

export function getCurrentCultureCache(): any;

export function getCurrentCulture(): CultureInfo;

export function getDefaultCulture(): CultureInfo;
