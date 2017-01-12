import { browserSupportsPassiveEventHandlers } from './browserSupportsPassiveEventHandlers';
import { isTouchDevice } from './isTouchDevice';

// This is primarily used for tooltips which behave differently on touch.
// For example, tooltips are commonly toggled on touch or disabled completely.
// To detect if mousemove is actually caused by a touch event, we check
// if device supports touch events and when the last touch event happened.
// Touch detection might cause bad scroll performance on devices which do not
// support passive event listeners, and in that case detection relies only on
// presence of touch events, without inspection of each event.

let insideTouchEvent = 0;
let lastTouchEvent = 0;
let isTouchDetectionEnabled = false;

export function enableTouchEventDetection() {
   if (isTouchDevice() && !isTouchDetectionEnabled) {
      let options;

      if (browserSupportsPassiveEventHandlers())
         options = {
            passive: true
         };

      document.addEventListener('touchstart', () => {
         insideTouchEvent++;
         //console.log('TOUCHSTART');
         lastTouchEvent = new Date().getTime();
      }, options);

      document.addEventListener('touchmove', () => {
         //console.log('TOUCHMOVE');
         lastTouchEvent = new Date().getTime();
      }, options);

      document.addEventListener('touchend', () => {
         insideTouchEvent--;
         lastTouchEvent = new Date().getTime();
         //console.log('TOUCHEND');
      }, options);

      isTouchDetectionEnabled = true;
   }
}

export function isTouchEvent() {
   return isTouchDevice() && (!isTouchDetectionEnabled || (new Date().getTime() - lastTouchEvent) < 1000);
}

//enable touch event detection if there is no performance penalty on scrolling
if (isTouchDevice() && browserSupportsPassiveEventHandlers())
   enableTouchEventDetection();
