import { batchUpdates } from "../../ui/batchUpdates";
import { getParentFrameBoundingClientRect } from "../../util/getParentFrameBoundingClientRect";

/**
 * Configuration options for mouse capture
 */
interface CaptureMouseOptions {
   /** Callback function called on mouse move events */
   onMouseMove?: (e: MouseEvent, captureData?: any) => void;
   /** Callback function called on mouse up events */
   onMouseUp?: (e: MouseEvent, captureData?: any) => void;
   /** Callback function called on double click events */
   onDblClick?: (e: MouseEvent) => void;
   /** Additional data passed to callbacks */
   captureData?: any;
   /** CSS cursor style for the capture surface */
   cursor?: string;
}

/**
 * Captures mouse events globally by creating a transparent overlay
 * @param e - The initial mouse event that triggered the capture
 * @param options - Configuration options for the capture behavior
 */
export function captureMouse2(
   e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent,
   options: CaptureMouseOptions,
): void {
   let surface = document.createElement("div");
   surface.className = "cxb-mousecapture";
   surface.style.cursor = options.cursor || getComputedStyle(e.currentTarget as Element).cursor;

   document.body.appendChild(surface);

   // In case when the event originates from an iframe,
   // we use that document as events do not bubble up.
   let parentDocument = (e.target as Element)?.ownerDocument;
   let eventOptions = { capture: true };

   let active = true;
   parentDocument.addEventListener("mousemove", move, eventOptions);
   parentDocument.addEventListener("mouseup", end, eventOptions);
   if (options.onDblClick) parentDocument.addEventListener("dblclick", doubleClick, eventOptions);

   function tear() {
      if (surface == null) return;
      parentDocument.removeEventListener("mousemove", move, eventOptions);
      parentDocument.removeEventListener("mouseup", end, eventOptions);
      if (options.onDblClick) parentDocument.removeEventListener("dblclick", doubleClick, eventOptions);
      document.body.removeChild(surface);
      surface = null as any;
   }

   function doubleClick(e: Event) {
      try {
         options.onDblClick && options.onDblClick(e as MouseEvent);
      } finally {
         tear();
      }
   }

   e.stopPropagation();

   function move(e: Event) {
      if (!active) {
         tear();
         return;
      }

      //if mouse moves double clicking is off
      options.onDblClick = undefined;

      batchUpdates(() => {
         if (options.onMouseMove) options.onMouseMove(e as MouseEvent, options.captureData);
         e.stopPropagation();
         e.preventDefault(); //disable text selection
      });
   }

   function end(e: Event) {
      active = false;
      batchUpdates(() => {
         // if (surface.releaseCapture)
         //    surface.releaseCapture();

         if (!options.onDblClick) surface.style.display = "none";
         try {
            if (options.onMouseUp) options.onMouseUp(e as MouseEvent, options.captureData);
         } finally {
            if (options.onDblClick) {
               //keep the surface a little longer to detect double clicks
               setTimeout(tear, 1500);
            } else tear();
         }
      });
   }
}

/**
 * Captures mouse or touch events, automatically detecting the event type
 * @param e - The initial mouse or touch event that triggered the capture
 * @param options - Configuration options for the capture behavior
 */
export function captureMouseOrTouch2(
   e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent,
   options: CaptureMouseOptions,
): void {
   if (e.type.indexOf("touch") == 0) {
      let el = e.currentTarget as HTMLElement;

      let move = (e: TouchEvent) => {
         batchUpdates(() => {
            if (options.onMouseMove) options.onMouseMove(e as any, options.captureData);
            e.preventDefault();
         });
      };

      let end = (e: TouchEvent) => {
         batchUpdates(() => {
            el.removeEventListener("touchmove", move);
            el.removeEventListener("touchend", end);

            if (options.onMouseUp) options.onMouseUp(e as any);

            e.preventDefault();
         });
      };

      el.addEventListener("touchmove", move);
      el.addEventListener("touchend", end);

      e.stopPropagation();
   } else captureMouse2(e, options);
}

/**
 * Legacy function for capturing mouse events with individual parameters
 * @param e - The initial mouse event that triggered the capture
 * @param onMouseMove - Callback function called on mouse move events
 * @param onMouseUp - Callback function called on mouse up events
 * @param captureData - Additional data passed to callbacks
 * @param cursor - CSS cursor style for the capture surface
 */
export function captureMouse(
   e: React.MouseEvent,
   onMouseMove?: (e: MouseEvent | TouchEvent, captureData?: any) => void,
   onMouseUp?: (e: MouseEvent | TouchEvent, captureData?: any) => void,
   captureData?: any,
   cursor?: string,
): void {
   captureMouse2(e, {
      onMouseMove,
      onMouseUp,
      captureData,
      cursor,
   });
}

/**
 * Legacy function for capturing mouse or touch events with individual parameters
 * @param e - The initial mouse or touch event that triggered the capture
 * @param onMouseMove - Callback function called on mouse/touch move events
 * @param onMouseUp - Callback function called on mouse/touch up events
 * @param captureData - Additional data passed to callbacks
 * @param cursor - CSS cursor style for the capture surface
 */
export function captureMouseOrTouch(
   e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent,
   onMouseMove?: (e: MouseEvent, captureData?: any) => void,
   onMouseUp?: (e: MouseEvent, captureData?: any) => void,
   captureData?: any,
   cursor?: string,
): void {
   captureMouseOrTouch2(e, { onMouseMove, onMouseUp, captureData, cursor });
}

/**
 * Gets the cursor position relative to the parent frame
 * @param e - Mouse or touch event (React or native)
 * @returns Object with clientX and clientY coordinates adjusted for parent frame offset
 */
export function getCursorPos(e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent): {
   clientX: number;
   clientY: number;
} {
   let p = (e as TouchEvent).touches?.[0] || (e as MouseEvent);
   let offset = getParentFrameBoundingClientRect(e.target as Element);
   return {
      clientX: p.clientX + offset.left,
      clientY: p.clientY + offset.top,
   };
}
