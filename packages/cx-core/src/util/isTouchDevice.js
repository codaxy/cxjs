let isTouch = null;

export function isTouchDevice() {
   if (isTouch == null)
      isTouch = 'ontouchstart' in window;
   return isTouch;
}
