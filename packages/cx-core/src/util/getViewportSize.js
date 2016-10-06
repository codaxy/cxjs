import {isTouchDevice} from './isTouchDevice';

export function getViewportSize() {
   if (isTouchDevice())
      return {
         width: Math.max(document.body.offsetWidth, window.innerWidth),
         height: Math.max(document.body.offsetHeight, window.innerHeight)
      }

   return {
      width: window.innerWidth,
      height: window.innerHeight
   }
}
