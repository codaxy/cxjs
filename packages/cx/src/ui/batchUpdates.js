import { VDOM } from './Widget';
import { SubscriberList } from '../util/SubscriberList';

let isBatching = 0;
let promiseSubscribers = new SubscriberList();

export function batchUpdates(callback) {
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

export function notifyBatchedUpdateStarting() {
   promiseSubscribers.execute(x=>{
      x.pending++;
   });
}

export function notifyBatchedUpdateCompleted() {
   promiseSubscribers.execute(x => {
      x.finished++;
      if (x.finished >= x.pending)
         x.complete(true);
   });
}

let updateId = 0;

export function batchUpdatesAndNotify(callback, notifyCallback, timeout = 1000) {
   let update = {
      id: ++updateId,
      pending: 0,
      finished: 0,
      done: false,
   };

   update.unsubscribe = promiseSubscribers.subscribe(update);
   update.complete = (success) => {
      if (!update.done) {
         update.done = true;
         if (update.timer)
            clearInterval(update.timer);
         update.unsubscribe();
         notifyCallback(!!success);
      }
   };

   batchUpdates(callback);

   if (update.pending <= update.finished)
      update.complete(true);
   else
      update.timer = setTimeout(update.complete, timeout);
}
