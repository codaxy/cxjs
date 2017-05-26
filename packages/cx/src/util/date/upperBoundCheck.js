import {dateDiff} from './dateDiff';

export function upperBoundCheck(date, maxDate, exclusive = false) {
   var d = dateDiff(date, maxDate);
   return d < 0 || (d == 0 && !exclusive);
}
