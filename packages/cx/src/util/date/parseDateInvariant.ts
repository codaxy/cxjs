// This module addresses a common issue when handling date strings in the format "yyyy-MM-dd" usually returned by backends.
// In time zones earlier than UTC, creating a Date object from such a string can result in the date being shifted one day earlier.
// This happens because "yyyy-MM-dd" is interpreted as a UTC date at 00:00, and when the browser displays it in local time, it adjusts backward.
// To resolve this, the default implementation (`defaultInvariantParseDate`) appends " 00:00" to the date string,
// explicitly indicating local time. Custom parsing logic can also be registered dynamically using `registerInvariantParseDateImpl`
// to accommodate other formats or requirements.
function defaultParseDateInvariant(input: string | number | Date): Date {
   if (typeof input == "string" && input.length == 10 && input[4] == "-" && input[7] == "-")
      return new Date(`${input} 00:00`);
   return new Date(input);
}
let impl: (input: string | number | Date) => Date = defaultParseDateInvariant;

export function parseDateInvariant(input: string | number | Date): Date {
   return impl(input);
}

export function overrideParseDateInvariant(newImpl: (input: string | number | Date) => Date): void {
   impl = newImpl;
}
