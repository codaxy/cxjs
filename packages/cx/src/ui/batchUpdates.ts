import { VDOM } from './Widget';
import { SubscriberList } from '../util/SubscriberList';

interface UpdateCallback {
   pending: number;
   finished: number;
   complete: (success?: boolean) => void;
}

let isBatching = 0;
let promiseSubscribers = new SubscriberList();

export function batchUpdates(callback: () => void): void {
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

export function isBatchingUpdates(): boolean {
   return isBatching > 0;
}

export function notifyBatchedUpdateStarting(): void {
   promiseSubscribers.execute((x: any) =>{
      (x as UpdateCallback).pending++;
   });
}

export function notifyBatchedUpdateCompleted(): void {
   promiseSubscribers.execute((x: any) => {
      let cb = x as UpdateCallback;
      cb.finished++;
      if (cb.finished >= cb.pending)
         cb.complete(true);
   });
}

let updateId = 0;

export function batchUpdatesAndNotify(callback: () => void, notifyCallback: (success: boolean) => void, timeout: number = 1000): void {
   let done = false;
   let timer: NodeJS.Timeout | undefined;
   let unsubscribe: (() => void) | undefined;

   const update: UpdateCallback = {
      pending: 0,
      finished: 0,
      complete: (success?: boolean) => {
         if (!done) {
            done = true;
            if (timer)
               clearInterval(timer);
            if (unsubscribe)
               unsubscribe();
            notifyCallback(!!success);
         }
      }
   };

   unsubscribe = promiseSubscribers.subscribe(update as any);

   batchUpdates(callback);

   if (update.pending <= update.finished)
      update.complete(true);
   else
      timer = setTimeout(update.complete, timeout);
}
