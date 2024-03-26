declare type Formatter = (any) => string;

export class Format {
   static value(v: any, format: string): string;

   static parse(format: string): Formatter;

   static register(format: string | string[], formatter: Formatter): void;

   static registerFactory(format: string | string[], factory: (...args) => Formatter): void;
}

export function resolveMinMaxFractionDigits(
   minimumFractionDigits: number,
   maximumFractionDigits: number,
): { minimumFractionDigits: number; maximumFractionDigits: number };

export function setGetFormatCacheCallback(callback: () => {}): void;
