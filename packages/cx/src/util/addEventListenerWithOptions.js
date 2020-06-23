import { browserSupportsPassiveEventHandlers } from "./browserSupportsPassiveEventHandlers";

export function addEventListenerWithOptions(element, event, callback, options) {
   let thirdParam = browserSupportsPassiveEventHandlers() ? options : options.capture === true;
   element.addEventListener(event, callback, thirdParam);
   return () => {
      element.removeEventListener(event, callback, thirdParam);
   };
}
