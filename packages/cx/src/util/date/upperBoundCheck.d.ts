/**
 * Checks `date` against the upper bound `maxDate`. Set `exclusive` to true to disallow the border value.
 * @param date 
 * @param maxDate 
 * @param exclusive
 * @returns {boolean}
 */
export function upperBoundCheck(date: Date, maxDate: Date, exclusive?: boolean) : boolean;