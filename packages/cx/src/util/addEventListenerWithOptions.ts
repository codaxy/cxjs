import { browserSupportsPassiveEventHandlers } from "./browserSupportsPassiveEventHandlers";

interface EventMap {
   wheel: WheelEvent;
   scroll: Event;
   click: MouseEvent;
   mousedown: MouseEvent;
   mouseup: MouseEvent;
   mousemove: MouseEvent;
   touchstart: TouchEvent;
   touchmove: TouchEvent;
   touchend: TouchEvent;
   keydown: KeyboardEvent;
   keyup: KeyboardEvent;
   keypress: KeyboardEvent;
}

export function addEventListenerWithOptions<K extends keyof EventMap>(
   element: Element | Document,
   event: K,
   callback: (event: EventMap[K]) => void,
   options: AddEventListenerOptions,
): () => void;
export function addEventListenerWithOptions(
   element: Element | Document,
   event: string,
   callback: (event: Event) => void,
   options: AddEventListenerOptions,
): () => void;
export function addEventListenerWithOptions(
   element: Element | Document,
   event: string,
   callback: (event: Event) => void,
   options: AddEventListenerOptions,
): () => void {
   let thirdParam = browserSupportsPassiveEventHandlers() ? options : options.capture === true;
   element.addEventListener(event, callback as any, thirdParam);
   return () => {
      element.removeEventListener(event, callback as any, thirdParam);
   };
}
