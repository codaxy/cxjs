export const Console = {
   log: function () {
      if (typeof window != 'undefined' && window.console)
         console.log(...arguments);
   },

   warn: function () {
      if (typeof window != 'undefined' && window.console)
         console.warn(...arguments);
   }
};
