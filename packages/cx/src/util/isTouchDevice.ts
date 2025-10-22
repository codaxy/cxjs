let isTouch: boolean | null = null;

export function isTouchDevice(): boolean {
   if (isTouch == null)
      isTouch = typeof window != 'undefined' && 'ontouchstart' in window;
   return isTouch;
}
