export const appLoopFlag = 'app-loop';
export const vdomRenderFlag = 'vdom-render';

import {now, enable, disable, count, log} from './timing-ops';

export const Timing = {
   now,
   enable,
   disable,
   count,
   log
};