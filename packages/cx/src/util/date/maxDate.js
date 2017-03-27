import {dateDiff} from './dateDiff';

export function maxDate() {
   var max = arguments[0];
   for (var i = 1; i < arguments.length; i++)
      if (dateDiff(max, arguments[i]) < 0)
         max = arguments[i];
   return max;
}
