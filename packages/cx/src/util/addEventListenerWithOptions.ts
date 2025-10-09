import { browserSupportsPassiveEventHandlers } from "./browserSupportsPassiveEventHandlers";

export function addEventListenerWithOptions(
   element: Element,
   event: string,
   callback: (event: Event) => void,
   options: AddEventListenerOptions
): () => void {
   let thirdParam = browserSupportsPassiveEventHandlers() ? options : options.capture === true;
   element.addEventListener(event, callback, thirdParam);
   return () => {
      element.removeEventListener(event, callback, thirdParam);
   };
}
