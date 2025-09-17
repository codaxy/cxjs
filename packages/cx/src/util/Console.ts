//@ts-nocheck
export const Console = {
   log: function () {
      if (typeof window != 'undefined' && window.console)
         console.log(...args);
   },

   warn: function () {
      if (typeof window != 'undefined' && window.console)
         console.warn(...args);
   }
};
