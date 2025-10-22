import {Console} from './Console';

export const appLoopFlag = 'app-loop';
export const vdomRenderFlag = 'vdom-render';

let counter: { [key: string]: number } = {};
let activeFlags: { [key: string]: boolean } = {};

let nowImpl: () => number = () => Date.now();

export function now(): number {
   if (process.env.NODE_ENV !== "production") {
      return nowImpl();
   } else {
      return 0;
   }
}

function enable(flag: string): void {
   if (process.env.NODE_ENV !== "production") {
      activeFlags[flag] = true;
   }
}

function disable(flag: string): void {
   if (process.env.NODE_ENV !== "production") {
      activeFlags[flag] = false;
   }
}

function count(flag: string): number | undefined {
   if (process.env.NODE_ENV !== "production") {
      if (!activeFlags[flag])
         return undefined;
      return counter[flag] = (counter[flag] || 0) + 1;
   }
   return undefined;
}

function log(flag: string, ...args: any[]): void {
   if (process.env.NODE_ENV !== "production") {
      if (!activeFlags[flag])
         return;

      Console.log(flag, ...args);
   }
}

if (process.env.NODE_ENV !== "production" && typeof window != 'undefined' && window.performance && typeof window.performance.now === 'function') {
   nowImpl = () => performance.now();
}

export const Timing = {
   now,
   enable,
   disable,
   count,
   log
};