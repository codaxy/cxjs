export class Console {
   static log() {
      if (typeof window != 'undefined' && window.console)
         console.log(...arguments);
   }

   static warn() {
      if (typeof window != 'undefined' && window.console)
         console.warn(...arguments);
   }
}
