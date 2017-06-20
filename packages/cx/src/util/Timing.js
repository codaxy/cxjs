import {Debug} from './Debug';

export const appLoopFlag = 'app-loop';
export const vdomRenderFlag = 'vdom-render';


let counter = {};
let activeFlags = {};

export class Timing {
   static now() {
      return new Date().getTime();
   }

   static enable(flag) {
      if (process.env.NODE_ENV !== "production") {
         activeFlags[flag] = true;
      }
   }

   static disable(flag) {
      activeFlags[flag] = false;
   }

   static count(flag) {
      if (process.env.NODE_ENV !== "production") {
         if (!activeFlags[flag])
            return;
         return counter[flag] = (counter[flag] || 0) + 1;
      }
   }

   static log(flag) {
      if (process.env.NODE_ENV !== "production") {
         if (!activeFlags[flag])
            return;

         Debug.log(...arguments);
      }
   }
}

if (process.env.NODE_ENV !== "production" && typeof window != 'undefined' && window.performance && window.performance.now) {
   Timing.now = function () {
      return performance.now();
   };
}
