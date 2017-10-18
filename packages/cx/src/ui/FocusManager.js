import { isSelfOrDescendant, findFirst, findFirstChild, isFocusable, closestParent } from '../util/DOM';
import { batchUpdates } from './batchUpdates';
import { SubscriberList } from '../util/SubscriberList';
import {isTouchEvent} from '../util/isTouchEvent';

/*
*  Purpose of FocusManager is to provide focusout notifications.
*  IE and Firefox do not provide relatedTarget info in blur events which makes it impossible
*  to determine if focus went outside or stayed inside the component.
*/

let subscribers = new SubscriberList(),
   intervalId;

let lastActiveElement = null;
let pending = false;

export class FocusManager {

   static subscribe(callback) {
      return subscribers.subscribe(callback);
   }

   static onFocusOut(el, callback) {
      let active = isSelfOrDescendant(el, document.activeElement);
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
      let off = this.subscribe(focusedEl => {
         if (!isSelfOrDescendant(el, focusedEl)) {
            callback(focusedEl);
            off();
         }
      });
      return off;
   }

   static nudge() {
      if (typeof document !== "undefined" && document.activeElement !== lastActiveElement) {
         if (!pending) {
            pending = true;
            setTimeout(function () {
               pending = false;
               if (document.activeElement !== lastActiveElement) {
                  lastActiveElement = document.activeElement;
                  batchUpdates(() => {
                     subscribers.notify(lastActiveElement);
                  })
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
      if (focusable)
         this.focus(focusable);
      return focusable;
   }

   static focusFirstChild(el) {
      let focusable = findFirstChild(el, isFocusable);
      if (focusable)
         this.focus(focusable);
      return focusable;
   }

   static focusNext(el) {
      let next = el, skip = true;
      do {
         if (!skip) {
            let focusable = this.focusFirst(next);
            if (focusable)
               return focusable;
         }

         if (next.nextSibling) {
            next = next.nextSibling;
            skip = false;
         }
         else {
            next = next.parentNode;
            skip = true;
         }
      } while (next);
   }

   static setInterval(interval) {
      clearInterval(intervalId);
      intervalId = setInterval(::this.nudge, interval);
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

export function preventFocus(e) {
   //Focus can be prevented only on mousedown event. On touchstart should not call
   //preventDefault as it prevents scrolling
   if (e.type !== "mousedown")
      return;

   e.preventDefault();

   //unfocus activeElement
   if (e.currentTarget !== document.activeElement && !document.activeElement.contains(e.currentTarget)) {
      //force field validation on outside click, however, preserve active window or dropdown menu
      let focusableParent = closestParent(document.activeElement, isFocusable) || document.body;
      if (focusableParent === document.body)
         document.activeElement.blur();
      else
         focusableParent.focus();

      FocusManager.nudge();
   }
}

export function preventFocusOnTouch(e, force = false) {
   if (force || isTouchEvent())
      preventFocus(e);
}

if (module.hot) {
   module.hot.accept();
   module.hot.dispose(function () {
      clearInterval(intervalId);
   });
}