import { isSelfOrDescendant, findFirst, isFocusable, closestParent } from '../util/DOM';
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
      if (typeof document != "undefined" && document.activeElement != lastActiveElement) {
         if (!pending) {
            pending = true;
            setTimeout(function () {
               pending = false;
               if (document.activeElement != lastActiveElement) {
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
   e.preventDefault();

   //unfocus activeElement
   if (e.currentTarget != document.activeElement && !document.activeElement.contains(e.currentTarget)) {
      //force field validation on outside click, however, preserve active window or dropdown menu
      let focusableParent = closestParent(document.activeElement, isFocusable) || document.body;
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