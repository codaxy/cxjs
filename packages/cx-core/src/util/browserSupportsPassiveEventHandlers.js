let passiveEventsSupported = null;

export function browserSupportsPassiveEventHandlers() {
   if (passiveEventsSupported == null) {
      try {
         passiveEventsSupported = false;
         const options = Object.defineProperty({}, 'passive', {
            get() {
               passiveEventsSupported = true;
            },
         });
         window.addEventListener('test', null, options);
      } catch (e) {
      }
   }

   return passiveEventsSupported;
}
