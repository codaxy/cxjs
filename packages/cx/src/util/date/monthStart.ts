/**
 * Returns the date representing the beginning of the month in respect to the date provided.
 * @param d
 * @returns {Date}
 */
export function monthStart(d: Date): Date {
   return new Date(d.getFullYear(), d.getMonth(), 1);
}
