import {Console} from './Console';

let activeFlags = {
   deprecated: true
};

export function debug(flag) {
   if (process.env.NODE_ENV !== "production") {
      if (!activeFlags[flag])
         return;

      Console.log(...arguments);
   }
}

export const Debug = {

   enable: function(flag) {
      if (process.env.NODE_ENV !== "production") {
         activeFlags[flag] = true;
      }
   },

   disable: function(flag) {
      if (process.env.NODE_ENV !== "production") {
         activeFlags[flag] = false;
      }
   },

   log: debug
};

export const renderFlag = 'render';
export const prepareFlag = 'prepare';
export const processDataFlag = 'process-data';
export const cleanupFlag = 'cleanup';
export const menuFlag = 'menu';
export const focusFlag = 'focus';
export const internalFlag = 'internal';
export const shouldUpdateFlag = 'should-update';
export const appDataFlag = 'app-data';
export const tooltipsFlag = 'tooltips';
export const deprecatedFlag = 'deprecated';
export const destroyFlag = 'destroy';

