import {dateDiff} from './dateDiff';

export function minDate() {
   var min = arguments[0];
   for (var i = 1; i<arguments.length; i++)
      if (dateDiff(min, arguments[i]) > 0)
         min = arguments[i];
   return min;
}
