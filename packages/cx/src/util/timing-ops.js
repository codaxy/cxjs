import {Console} from './Console';

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

export function enable(flag) {
   if (process.env.NODE_ENV !== "production") {
      activeFlags[flag] = true;
   }
}

export function disable(flag) {
   if (process.env.NODE_ENV !== "production") {
      activeFlags[flag] = false;
   }
}

export function count(flag) {
   if (process.env.NODE_ENV !== "production") {
      if (!activeFlags[flag])
         return;
      return counter[flag] = (counter[flag] || 0) + 1;
   }
}

export function log(flag) {
   if (process.env.NODE_ENV !== "production") {
      if (!activeFlags[flag])
         return;

      Debug.log(...arguments);
   }
}

if (process.env.NODE_ENV !== "production" && typeof window != 'undefined' && window.performance && window.performance.now) {
   nowImpl = () => performance.now();
}
