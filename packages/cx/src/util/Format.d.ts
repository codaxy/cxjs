declare type Formatter = (any) => string;

export class Format {

   static value(v: any, format: string): string;

   static parse(format: string): Formatter;

   static register(format: string, formatter: Formatter): void;

   static registerFactory(format: string, factory: (...args) => Formatter): void;
}

export function resolveMinMaxFractionDigits(minimumFractionDigits, maximumFractionDigits);