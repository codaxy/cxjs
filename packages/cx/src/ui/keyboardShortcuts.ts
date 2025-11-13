import { SubscriberList } from "../util/SubscriberList";
import { isObject } from "../util/isObject";

interface KeyDescriptor {
   keyCode: number;
   shiftKey?: boolean;
   ctrlKey?: boolean;
   altKey?: boolean;
}

export type KeyboardShortcut = number | KeyDescriptor;

let subscribers: any, eventBan = 0;

export function executeKeyboardShortcuts(e: KeyboardEvent) {
   if (Date.now() < eventBan) return;
   // Avoid duplicate executions as event.stopPropagation() for React events does not stop native events
   eventBan = Date.now() + 5;
   subscribers && subscribers.notify(e);
}

export function registerKeyboardShortcut(key: number | KeyDescriptor, callback: (e: KeyboardEvent) => void) {
   const keyCode = isObject(key) ? (key as KeyDescriptor).keyCode : key;
   const shiftKey = isObject(key) ? (key as KeyDescriptor).shiftKey : false;
   const ctrlKey = isObject(key) ? (key as KeyDescriptor).ctrlKey : false;
   const altKey = isObject(key) ? (key as KeyDescriptor).altKey : false;

   if (!subscribers) {
      subscribers = new SubscriberList();
      document.addEventListener("keydown", (e: any) => {
         if (e.target == document.body)
            executeKeyboardShortcuts(e);
      });
   }

   return subscribers.subscribe((e: any) => {
      if (e.keyCode == keyCode && (!shiftKey || e.shiftKey) && (!ctrlKey || e.ctrlKey) && (!altKey || e.altKey))
         callback(e);
   });
}
