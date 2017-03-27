import { SubscriberList } from '../util/SubscriberList';
import { batchUpdates } from './batchUpdates';

let subscribers = new SubscriberList();

export class ResizeManager {
   static subscribe(callback) {
      return subscribers.subscribe(callback);
   }

   static notify() {
      batchUpdates(() => {
         subscribers.notify();
      });
   }
}

if (typeof window != 'undefined')
   window.addEventListener('resize', () => ResizeManager.notify());