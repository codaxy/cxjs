import {debug, deprecatedFlag} from '../../util/Debug';

debug(deprecatedFlag, 'date/diff function is deprecated since v16.8. It will be removed in future versions. Use dateDiff instead.');

export function diff(d1, d2) {
   return d1.getTime() - d2.getTime();
}
