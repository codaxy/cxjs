export const Console = {
   log: (...args: any[]): void => {
      if (typeof window != "undefined" && window.console) console.log(...args);
   },

   warn: (...args: any[]): void => {
      if (typeof window != "undefined" && window.console) console.warn(...args);
   },

   error: (...args: any[]): void => {
      if (typeof window != "undefined" && window.console) console.error(...args);
   },
};
