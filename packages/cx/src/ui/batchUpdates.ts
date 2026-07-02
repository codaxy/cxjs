import { VDOM } from "./VDOM";
import { SubscriberList } from "../util/SubscriberList";

interface UpdateCallback {
   pending: number;
   finished: number;
   watermark: number;
   complete: (success?: boolean) => void;
}

let isBatching = 0;
let updateSequence = 0;
let promiseSubscribers = new SubscriberList();

export function batchUpdates(callback: () => void): void {
   if (VDOM.DOM.unstable_batchedUpdates)
      VDOM.DOM.unstable_batchedUpdates(() => {
         isBatching++;
         try {
            callback();
         } finally {
            isBatching--;
         }
      });
   else callback();
}

export function isBatchingUpdates(): boolean {
   return isBatching > 0;
}

// Returns a sequence number identifying the update; pass it to notifyBatchedUpdateCompleted once the
// update is rendered.
export function notifyBatchedUpdateStarting(): number {
   let seq = ++updateSequence;
   promiseSubscribers.execute((x: any) => {
      (x as UpdateCallback).pending++;
   });
   return seq;
}

export function notifyBatchedUpdateCompleted(seq: number): void {
   promiseSubscribers.execute((x: any) => {
      let cb = x as UpdateCallback;
      // ignore updates that started before this subscriber attached -- counting them would let the notify
      // callback fire before the updates the subscriber is actually waiting on are rendered
      if (seq <= cb.watermark) return;
      cb.finished++;
      if (cb.finished >= cb.pending) cb.complete(true);
   });
}

export function batchUpdatesAndNotify(
   callback: () => void,
   notifyCallback: (success: boolean) => void,
   timeout: number = 1000,
): void {
   let done = false;
   let timer: NodeJS.Timeout | undefined;
   let unsubscribe: (() => void) | undefined;

   const update: UpdateCallback = {
      pending: 0,
      finished: 0,
      watermark: updateSequence,
      complete: (success?: boolean) => {
         if (!done) {
            done = true;
            if (timer) clearInterval(timer);
            if (unsubscribe) unsubscribe();
            notifyCallback(!!success);
         }
      },
   };

   unsubscribe = promiseSubscribers.subscribe(update as any);

   batchUpdates(callback);

   if (update.pending <= update.finished) update.complete(true);
   else timer = setTimeout(update.complete, timeout);
}
