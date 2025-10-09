/**
 * Returns `true` if the dates provided represent the same day.
 * @param d1
 * @param d2
 * @returns {boolean}
 */
export function sameDate(d1: Date, d2: Date): boolean {
   return d1.getDate() == d2.getDate()
      && d1.getMonth() == d2.getMonth()
      && d1.getYear() == d2.getYear();
}
