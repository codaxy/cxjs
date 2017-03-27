import {dateDiff} from './dateDiff';

export function lowerBoundCheck(date, minDate, exclusive = false) {
   var d = dateDiff(date, minDate);
   return d > 0 || (d == 0 && !exclusive);
}
