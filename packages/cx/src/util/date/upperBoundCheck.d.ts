/**
 * Checks `date` against the upper bound `maxDate`. Set `exclusive` to false to allow the border value.
 * @param {Date} date 
 * @param {Date} maxDate 
 * @param {boolean} [exclusive=true]
 * @returns {boolean}
 */
export function upperBoundCheck(date: Date, maxDate: Date, exclusive?: boolean) : boolean;