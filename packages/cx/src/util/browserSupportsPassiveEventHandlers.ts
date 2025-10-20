let passiveEventsSupported: boolean | null = null;

/**
 * Checks if the browser supports passive event handlers.
 * @returns {boolean}
 */
export function browserSupportsPassiveEventHandlers(): boolean {
   if (passiveEventsSupported == null) {
      try {
         passiveEventsSupported = false;
         const options = Object.defineProperty({}, "passive", {
            get() {
               passiveEventsSupported = true;
            },
         });
         window.addEventListener("test" as any, null as any, options);
      } catch (e) {}
   }
   return passiveEventsSupported!;
}
