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
   timerId: any = null;

let lastActiveElement: any = null;
let pending = false;

export class FocusManager {
   static subscribe(callback: (el: any) => void) {
      let unsubscribe = subscribers.subscribe(callback);
      checkTimer();
      return unsubscribe;
   }

   static onFocusOut(el: any, callback: (el: any) => void) {
      let active = isSelfOrDescendant(el, getActiveElement());
      return this.subscribe((focusedEl: any) => {
         if (!active) active = isSelfOrDescendant(el, getActiveElement());
         else if (!isSelfOrDescendant(el, focusedEl)) {
            active = false;
            callback(focusedEl);
         }
      });
   }

   static oneFocusOut(el: any, callback: (el: any) => void) {
      this.nudge();
      let off = this.subscribe((focusedEl: any) => {
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

   static focus(el: HTMLElement) {
      el.focus();
      this.nudge();
   }

   static focusFirst(el: HTMLElement) {
      let focusable = findFirst(el, isFocusable);
      if (focusable) this.focus(focusable as HTMLElement);
      return focusable;
   }

   static focusFirstChild(el: HTMLElement) {
      let focusable = findFirstChild(el, isFocusable);
      if (focusable) this.focus(focusable as HTMLElement);
      return focusable;
   }

   static focusNext(el: HTMLElement) {
      let next: Node | null = el,
         skip = true;
      do {
         if (!skip) {
            let focusable = this.focusFirst(next as HTMLElement);
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

   static setInterval(interval: number) {
      timerInterval = interval;
      checkTimer();
   }
}

export function oneFocusOut(component: any, el: any, callback: (focus: any) => void) {
   if (!component.oneFocusOut)
      component.oneFocusOut = FocusManager.oneFocusOut(el, (focus: any) => {
         delete component.oneFocusOut;
         callback(focus);
      });
}

export function offFocusOut(component: any) {
   if (component.oneFocusOut) {
      component.oneFocusOut();
      delete component.oneFocusOut;
   }
}

export function preventFocus(e: React.MouseEvent) {
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

export function preventFocusOnTouch(e: any, force = false) {
   if (force || isTouchEvent()) preventFocus(e);
}

export function unfocusElement(target: Element | null = null, unfocusParentOverlay = true) {
   const activeElement = getActiveElement();
   if (!target) target = activeElement;

   if (unfocusParentOverlay) {
      let focusableOverlayContainer = closestParent(target, (el: any) => el.dataset?.focusableOverlayContainer);
      if (focusableOverlayContainer) target = focusableOverlayContainer;
   }

   //find the closest focusable parent of the target element and focus it instead
   let focusableParent = closestParent(
      target,
      (el: any) => isFocusable(el) && (!unfocusParentOverlay || !!el.dataset?.focusableOverlayContainer),
   ) as HTMLElement | null;

   if (focusableParent && focusableParent !== document.body) focusableParent.focus({ preventScroll: true });
   else (activeElement as HTMLElement).blur();

   FocusManager.nudge();
}
