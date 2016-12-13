import {isSelfOrDescendant, findFirst, isFocusable, isFocusedDeep} from '../util/DOM';

/*
*  Purpose of FocusManager is to provide focusout notifications.
*  IE and Firefox do not provide relatedTarget info in blur events which makes it impossible
*  to determine if focus went outside or stayed inside the component.
 */

var nextSlot = 1,
   freeSlots = [],
   subscriptions = {},
   intervalId;

function getSlot() {
   if (freeSlots.length)
      return freeSlots.pop();

   var slot = String(nextSlot++);
   return slot;
}

function recycle(slot, callback) {
   if (subscriptions[slot] === callback) {
      freeSlots.push(slot);
      delete subscriptions[slot];
   }
}

var lastActiveElement = null;
var pending = false;

export class FocusManager {

   static subscribe(callback) {
      var slot = getSlot();
      subscriptions[slot] = callback;
      return function () {
         recycle(slot, callback);
      }
   }

   static onFocusOut(el, callback) {
      var active = isSelfOrDescendant(el, document.activeElement);
      return this.subscribe(focusedEl => {
         if (!active)
            active = isSelfOrDescendant(el, document.activeElement);
         else if (!isSelfOrDescendant(el, focusedEl)) {
            active = false;
            callback(focusedEl);
         }
      });
   }

   static oneFocusOut(el, callback) {
      this.nudge();
      var off = this.subscribe(focusedEl => {
         if (!isSelfOrDescendant(el, focusedEl)) {
            callback(focusedEl);
            off();
         }
      });
      return off;
   }

   static nudge() {
      if (document.activeElement != lastActiveElement) {
         if (!pending) {
            pending = true;
            setTimeout(function () {
               pending = false;
               if (document.activeElement != lastActiveElement) {
                  lastActiveElement = document.activeElement;
                  Object.keys(subscriptions).forEach(key=> {
                     var cb = subscriptions[key];
                     if (cb)
                        cb(lastActiveElement);
                  });
               }
            }, 0);
         }
      }
   }

   static focus(el) {
      el.focus();
      this.nudge();
   }

   static focusFirst(el) {
      var focusable = findFirst(el, isFocusable);
      if (focusable)
         this.focus(focusable);
      return focusable;
   }

   static setInterval(interval) {
      window.clearInterval(intervalId);
      intervalId = window.setInterval(::this.nudge, interval);
   }
}

FocusManager.setInterval(300);

export function oneFocusOut(component, el, callback) {
   if (!component.oneFocusOut)
      component.oneFocusOut = FocusManager.oneFocusOut(el, (focus)=> {
         delete component.oneFocusOut;
         callback(focus);
      });
}

export function offFocusOut(component) {
   if (component.oneFocusOut) {
      component.oneFocusOut();
      delete component.oneFocusOut;
   }
}

if (module.hot) {
   module.hot.accept();
   module.hot.dispose(function () {
      clearInterval(intervalId);
   });
}