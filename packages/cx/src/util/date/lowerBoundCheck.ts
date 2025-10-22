import {dateDiff} from './dateDiff';

/**
 * Checks `date` against the lower bound `minDate`. Set `exclusive` to true to disallow the border value.
 * @param date
 * @param minDate
 * @param [exclusive=false]
 * @returns {boolean}
 */
export function lowerBoundCheck(date: Date, minDate: Date, exclusive: boolean = false): boolean {
   var d = dateDiff(date, minDate);
   return d > 0 || (d == 0 && !exclusive);
}
