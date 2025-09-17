//@ts-nocheck
import { isSelfOrDescendant, findFirst, findFirstChild, isFocusable, closestParent } from "../util/DOM";
import { batchUpdates } from "./batchUpdates";
import { SubscriberList } from "../util/SubscriberList";
import { isTouchEvent } from "../util/isTouchEvent";
import { getActiveElement } from "../util/getActiveElement";

/*
 *  Purpose of FocusManager is to provide focusout notifications.
 *  IE and Firefox do not provide relatedTarget info in blur events which makes it impossible
 *  to determine if focus went outside or stayed inside the component.
 */

let subscribers = new SubscriberList(),
   timerInterval = 300,
   timerId = null;

let lastActiveElement = null;
let pending = false;

export class FocusManager {
   static subscribe(callback) {
      let unsubscribe = subscribers.subscribe(callback);
      checkTimer();
      return unsubscribe;
   }

   static onFocusOut(el, callback) {
      let active = isSelfOrDescendant(el, getActiveElement());
      return this.subscribe((focusedEl) => {
         if (!active) active = isSelfOrDescendant(el, getActiveElement());
         else if (!isSelfOrDescendant(el, focusedEl)) {
            active = false;
            callback(focusedEl);
         }
      });
   }

   static oneFocusOut(el, callback) {
      this.nudge();
      let off = this.subscribe((focusedEl) => {
         if (!isSelfOrDescendant(el, focusedEl)) {
            callback(focusedEl);
            off();
         }
      });
      return off;
   }

   static nudge() {
      if (typeof document !== "undefined" && getActiveElement() !== lastActiveElement) {
         if (!pending) {
            pending = true;
            setTimeout(function () {
               pending = false;
               if (getActiveElement() !== lastActiveElement) {
                  lastActiveElement = getActiveElement();
                  batchUpdates(() => {
                     subscribers.notify(lastActiveElement);
                  });
                  checkTimer();
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
      let focusable = findFirst(el, isFocusable);
      if (focusable) this.focus(focusable);
      return focusable;
   }

   static focusFirstChild(el) {
      let focusable = findFirstChild(el, isFocusable);
      if (focusable) this.focus(focusable);
      return focusable;
   }

   static focusNext(el) {
      let next = el,
         skip = true;
      do {
         if (!skip) {
            let focusable = this.focusFirst(next);
            if (focusable) return focusable;
         }

         if (next.nextSibling) {
            next = next.nextSibling;
            skip = false;
         } else {
            next = next.parentNode;
            skip = true;
         }
      } while (next);
   }

   static setInterval(interval) {
      timerInterval = interval;
      checkTimer();
   }
}

export function oneFocusOut(component, el, callback) {
   if (!component.oneFocusOut)
      component.oneFocusOut = FocusManager.oneFocusOut(el, (focus) => {
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

export function preventFocus(e) {
   //Focus can be prevented only on mousedown event. On touchstart this will not work
   //preventDefault cannot be used as it prevents scrolling
   if (e.type !== "mousedown") return;

   e.preventDefault();

   unfocusElement(e.currentTarget, false);
}

function checkTimer() {
   let shouldRun = !subscribers.isEmpty();

   if (shouldRun && !timerId)
      timerId = setInterval(() => {
         FocusManager.nudge();
      }, timerInterval);

   if (!shouldRun && timerId) {
      clearInterval(timerId);
      timerId = null;
   }
}

export function preventFocusOnTouch(e, force = false) {
   if (force || isTouchEvent()) preventFocus(e);
}

export function unfocusElement(target = null, unfocusParentOverlay = true) {
   const activeElement = getActiveElement();
   if (!target) target = activeElement;

   if (unfocusParentOverlay) {
      let focusableOverlayContainer = closestParent(target, (el) => el.dataset?.focusableOverlayContainer);
      if (focusableOverlayContainer) target = focusableOverlayContainer;
   }

   //find the closest focusable parent of the target element and focus it instead
   let focusableParent = closestParent(
      target,
      (el) => isFocusable(el) && (!unfocusParentOverlay || el.dataset?.focusableOverlayContainer),
   );

   if (focusableParent && focusableParent !== document.body) focusableParent.focus({ preventScroll: true });
   else activeElement.blur();

   FocusManager.nudge();
}
