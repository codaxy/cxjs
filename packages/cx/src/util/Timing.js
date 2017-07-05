import {Console} from './Console';

export const appLoopFlag = 'app-loop';
export const vdomRenderFlag = 'vdom-render';

let counter = {};
let activeFlags = {};

let nowImpl = () => Date.now();

export function now() {
   if (process.env.NODE_ENV !== "production") {
      return nowImpl();
   } else {
      return 0;
   }
}

function enable(flag) {
   if (process.env.NODE_ENV !== "production") {
      activeFlags[flag] = true;
   }
}

function disable(flag) {
   if (process.env.NODE_ENV !== "production") {
      activeFlags[flag] = false;
   }
}

function count(flag) {
   if (process.env.NODE_ENV !== "production") {
      if (!activeFlags[flag])
         return;
      return counter[flag] = (counter[flag] || 0) + 1;
   }
}

function log(flag) {
   if (process.env.NODE_ENV !== "production") {
      if (!activeFlags[flag])
         return;

      Console.log(...arguments);
   }
}

if (process.env.NODE_ENV !== "production" && typeof window != 'undefined' && window.performance && window.performance.now) {
   nowImpl = () => performance.now();
}

export const Timing = {
   now,
   enable,
   disable,
   count,
   log
};