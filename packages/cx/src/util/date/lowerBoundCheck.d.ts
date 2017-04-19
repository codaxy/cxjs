/**
 * Checks `date` against the lower bound `minDate`. Set `exclusive` to false to allow the border value.
 * @param {Date} date 
 * @param {Date} minDate 
 * @param {boolean} [exclusive=true] 
 * @returns {boolean}
 */
export function lowerBoundCheck(date: Date, minDate: Date, exclusive?: boolean) : boolean;