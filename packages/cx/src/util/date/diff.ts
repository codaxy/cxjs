import {debug, deprecatedFlag} from '../../util/Debug';

debug(deprecatedFlag, 'date/diff function is deprecated since v16.8. It will be removed in future versions. Use dateDiff instead.');

/**
 * @deprecated
 * date/diff function is deprecated since v16.8. It will be removed in future versions. Use dateDiff instead.
 * @param d1
 * @param d2
 */
export function diff(d1: Date, d2: Date): number {
   return d1.getTime() - d2.getTime();
}
