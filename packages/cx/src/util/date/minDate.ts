import {dateDiff} from './dateDiff';

/**
 * Returns the minimum Date value from the provided values.
 * @param args
 * @returns {Date}
 */
export function minDate(...args: Date[]): Date {
   var min = args[0];
   for (var i = 1; i<args.length; i++)
      if (dateDiff(min, args[i]) > 0)
         min = args[i];
   return min;
}
