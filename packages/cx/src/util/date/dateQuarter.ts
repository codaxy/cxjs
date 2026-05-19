/**
 * Returns the calendar quarter (1-4) the given date falls in.
 * @param date
 * @returns {number}
 */
export function dateQuarter(date: Date): number {
   return Math.floor(date.getMonth() / 3) + 1;
}
