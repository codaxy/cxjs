import { VDOM } from './Widget';

let isBatching = 0;

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
