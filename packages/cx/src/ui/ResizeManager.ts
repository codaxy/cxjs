import { SubscriberList } from '../util/SubscriberList';
import { batchUpdates } from './batchUpdates';

let subscribers = new SubscriberList();

export class ResizeManager {
   static subscribe(callback: () => void) {
      return subscribers.subscribe(callback);
   }

   static notify() {
      batchUpdates(() => {
         subscribers.notify();
      });
   }

   static trackElement(el: any, callback: (entries: ResizeObserverEntry[]) => void) {
      if (typeof ResizeObserver !== 'function')
         return this.subscribe(() => callback([]));

      let obs = new ResizeObserver(callback);
      obs.observe(el);

      return () => {
         obs.disconnect();
      }
   }
}

if (typeof window != 'undefined')
   window.addEventListener('resize', () => ResizeManager.notify());