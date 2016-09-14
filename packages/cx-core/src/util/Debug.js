import {Console} from './Console';

var activeFlags = {
   deprecated: true
};
const env = process.env.NODE_ENV;

export class Debug {

   static enable(flag) {
      activeFlags[flag] = true;
   }

   static disable(flag) {
      activeFlags[flag] = false;
   }

   static log(flag) {
      if (env != "production") {
         if (!activeFlags[flag])
            return;

         Console.log(...arguments);
      }
   }
}

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

