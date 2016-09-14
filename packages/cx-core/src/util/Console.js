export class Console {
   static log() {
      if (window && window.console)
         console.log(...arguments);
   }

   static warn() {
      if (window && window.console)
         console.warn(...arguments);
   }
}
