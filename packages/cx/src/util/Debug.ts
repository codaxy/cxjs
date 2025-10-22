import { Console } from './Console';

export type DebugFlag =
   | 'render'
   | 'prepare'
   | 'process-data'
   | 'cleanup'
   | 'menu'
   | 'focus'
   | 'internal'
   | 'should-update'
   | 'app-data'
   | 'tooltips'
   | 'deprecated'
   | 'destroy'
   | string; // Allow custom flags

interface DebugFlags {
   [flag: string]: boolean;
}

let activeFlags: DebugFlags = {
   deprecated: true
};

export function debug(flag: DebugFlag, ...args: any[]): void {
   if (process.env.NODE_ENV !== "production") {
      if (!activeFlags[flag])
         return;

      Console.log(flag + ':', ...args);
   }
}

export const Debug = {
   enable(flag: DebugFlag): void {
      if (process.env.NODE_ENV !== "production") {
         activeFlags[flag] = true;
      }
   },

   disable(flag: DebugFlag): void {
      if (process.env.NODE_ENV !== "production") {
         activeFlags[flag] = false;
      }
   },

   isEnabled(flag: DebugFlag): boolean {
      return process.env.NODE_ENV !== "production" && !!activeFlags[flag];
   },

   getActiveFlags(): Readonly<DebugFlags> {
      return { ...activeFlags };
   },

   log: debug
};

export const renderFlag: DebugFlag = 'render';
export const prepareFlag: DebugFlag = 'prepare';
export const processDataFlag: DebugFlag = 'process-data';
export const cleanupFlag: DebugFlag = 'cleanup';
export const menuFlag: DebugFlag = 'menu';
export const focusFlag: DebugFlag = 'focus';
export const internalFlag: DebugFlag = 'internal';
export const shouldUpdateFlag: DebugFlag = 'should-update';
export const appDataFlag: DebugFlag = 'app-data';
export const tooltipsFlag: DebugFlag = 'tooltips';
export const deprecatedFlag: DebugFlag = 'deprecated';
export const destroyFlag: DebugFlag = 'destroy';

