import { VDOM } from './Widget';
import { SubscriberList } from '../util/SubscriberList';

let isBatching = 0;
let updateSubscribers = new SubscriberList();

export function batchUpdates(callback, didUpdateCallback) {

   if (didUpdateCallback) {
      updateSubscribers.subscribe(didUpdateCallback);
   }

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
}

export function isBatchingUpdates() {
   return isBatching > 0;
}

export function notifyBatchedUpdateCompleted() {
   updateSubscribers.notify();
   updateSubscribers.clear();
}

