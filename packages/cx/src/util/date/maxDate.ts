import {dateDiff} from './dateDiff';

/**
 * Returns the maximum Date value from the provided values.
 * @param args
 * @returns {Date}
 */
export function maxDate(...args: Date[]): Date {
   var max = args[0];
   for (var i = 1; i < args.length; i++)
      if (dateDiff(max, args[i]) < 0)
         max = args[i];
   return max;
}
