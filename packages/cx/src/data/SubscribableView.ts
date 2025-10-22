import { View, ViewConfig } from "./View";
import { SubscriberList } from "../util/SubscriberList";

export interface SubscribableViewConfig extends ViewConfig {
   async?: boolean;
}

export class SubscribableView<D> extends View<D> {
   subscribers?: any;
   changes: string[];
   async: boolean;
   scheduled: boolean;

   constructor(config?: SubscribableViewConfig) {
      super(config);
      this.subscribers = new SubscriberList();
      this.changes = [];
   }

   subscribe(callback: () => void) {
      return this.subscribers.subscribe(callback);
   }

   unsubscribeAll() {
      this.subscribers.clear();
   }

   doNotify(path: string) {
      if (this.notificationsSuspended) return;

      if (!this.async) {
         this.subscribers.notify([path]);
      } else {
         this.changes.push(path || "");
         if (!this.scheduled) {
            this.scheduled = true;
            setTimeout(() => {
               this.scheduled = false;
               let changes = this.changes;
               this.changes = [];
               this.subscribers.notify(changes);
            }, 0);
         }
      }
   }

   silently(callback: (store?: View) => void) {
      this.notificationsSuspended = (this.notificationsSuspended || 0) + 1;
      let wasDirty = this.dirty,
         dirty;
      this.dirty = false;
      try {
         callback(this);
      } finally {
         this.notificationsSuspended--;
         dirty = this.dirty;
         this.dirty = wasDirty;
      }
      return dirty;
   }
}

SubscribableView.prototype.async = false;
