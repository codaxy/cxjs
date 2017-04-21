/**
 * Checks `date` against the lower bound `minDate`. Set `exclusive` to false to allow the border value.
 * @param date 
 * @param minDate 
 * @param [exclusive=true] 
 * @returns {boolean}
 */
export function lowerBoundCheck(date: Date, minDate: Date, exclusive?: boolean) : boolean;