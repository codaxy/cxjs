/**
 * Returns a new `Date` representing the calendar day before the given date,
 * keeping the same time of day. Month and year boundaries are handled
 * automatically. The input is not mutated.
 *
 * Useful for displaying the exclusive end of a date range as an inclusive
 * value, e.g. a period ending at `2021-01-01` shown as `Dec 2020`.
 * @param date
 * @returns {Date}
 */
export function dayBefore(date: Date): Date {
   let result = new Date(date.getTime());
   result.setDate(result.getDate() - 1);
   return result;
}
