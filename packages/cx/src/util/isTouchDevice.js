let isTouch = null;

export function isTouchDevice() {
   if (isTouch == null)
      isTouch = typeof window != 'undefined' && 'ontouchstart' in window;
   return isTouch;
}
