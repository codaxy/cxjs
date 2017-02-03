import { VDOM } from './Widget';

export function batchUpdates(callback) {
   if (VDOM.DOM.unstable_batchedUpdates)
      VDOM.DOM.unstable_batchedUpdates(() => {
         callback();
      });
   else
      callback();
}
