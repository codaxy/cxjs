export function parseDateInvariant(input: string | number | Date): Date;

export function overrideParseDateInvariant(newImpl: (input: string | number | Date) => Date): void;
