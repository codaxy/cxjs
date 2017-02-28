import {Console} from './Console';

export const appLoopFlag = 'app-loop';
export const vdomRenderFlag = 'vdom-render';


var counter = {};
const env = process.env.NODE_ENV;

export class Timing {
   static now() {
      return new Date().getTime();
   }

   static enable(flag) {
      activeFlags[flag] = true;
   }

   static disable(flag) {
      activeFlags[flag] = false;
   }

   static count(flag) {
      if (env != "production") {
         if (!activeFlags[flag])
            return;
         return counter[flag] = (counter[flag] || 0) + 1;
      }
   }

   static log(flag) {
      if (env != "production") {
         if (!activeFlags[flag])
            return;

         Console.log(...arguments);
      }
   }
}

var activeFlags = {};

if (typeof window != 'undefined' && window.performance && window.performance.now) {
   Timing.now = function () {
      return performance.now();
   };
}
