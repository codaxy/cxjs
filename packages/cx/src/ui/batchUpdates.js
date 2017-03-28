import { VDOM } from './Widget';
import { SubscriberList } from '../util/SubscriberList';

let isBatching = 0;
let pendingUpdates = 0;
let updateSubscribers = new SubscriberList();

export function batchUpdates(callback, didUpdateCallback) {
   if (VDOM.DOM.unstable_batchedUpdates)
      VDOM.DOM.unstable_batchedUpdates(() => {
         isBatching++;
         try {
            callback();
         }
         finally {
            isBatching--;
         }
      });
   else
      callback();

   if (didUpdateCallback) {
      if (pendingUpdates == 0)
         didUpdateCallback();
      else
         updateSubscribers.subscribe(didUpdateCallback);
   }
}

export function isBatchingUpdates() {
   return isBatching > 0;
}

export function notifyBatchedUpdateStarting() {
   pendingUpdates++;
}

export function notifyBatchedUpdateCompleted() {
   if (--pendingUpdates == 0) {
      updateSubscribers.notify();
      updateSubscribers.clear();
   }
}

