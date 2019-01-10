import {SubscriberList} from "../util/SubscriberList";
import {isObject} from "../util/isObject";

let subscribers, eventBan = 0;

export function executeKeyboardShortcuts(e) {
   if (Date.now() < eventBan)
      return;
   //Avoid duplicate executions as event.stopPropagation() for React events does not stop native events
   eventBan = Date.now() + 5;
   subscribers && subscribers.notify(e);
}

export function registerKeyboardShortcut(key, callback) {
   const keyCode = isObject(key) ? key.keyCode : key;
   const shiftKey = isObject(key) ? key.shiftKey : false;
   const ctrlKey = isObject(key) ? key.ctrlKey : false;
   const altKey = isObject(key) ? key.altKey : false;

   if (!subscribers) {
      subscribers = new SubscriberList();
      document.addEventListener("keydown", e => {
         if (e.target == document.body)
            executeKeyboardShortcuts(e);
      });
   }

   return subscribers.subscribe(e => {
      if (e.keyCode == keyCode && (!shiftKey || e.shiftKey) && (!ctrlKey || e.ctrlKey) && (!altKey || e.altKey))
         callback(e);
   });
}
