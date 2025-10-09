import {dateDiff} from './dateDiff';

/**
 * Checks `date` against the upper bound `maxDate`. Set `exclusive` to true to disallow the border value.
 * @param date
 * @param maxDate
 * @param exclusive
 * @returns {boolean}
 */
export function upperBoundCheck(date: Date, maxDate: Date, exclusive: boolean = false): boolean {
   var d = dateDiff(date, maxDate);
   return d < 0 || (d == 0 && !exclusive);
}
