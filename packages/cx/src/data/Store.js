import {Binding} from './Binding';
import {View} from './View';
import {SubscriberList} from '../util/SubscriberList';

export class Store extends View {
   constructor(config = {}) {
      super();
      this.data = config.data || {};
      this.subscribers = new SubscriberList();
      this.changes = [];
      this.meta = {
         version: 0
      }
   }

   getData() {
      return this.data;
   }

   setItem(path, value) {
      let next = Binding.get(path).set(this.data, value);
      if (next != this.data) {
         this.data = next;
         this.meta.version++;
         this.notify(path);
         return true;
      }
      return false;
   }
   
   deleteItem(path) {
      let next = Binding.get(path).delete(this.data);
      if (next != this.data) {
         this.data = next;
         this.meta.version++;
         this.notify(path);
         return true;
      }
      return false;
   }
   
   clear() {
      this.data = {};
      this.meta.version++;
      this.notify();
   }

   subscribe(callback) {
      return this.subscribers.subscribe(callback);
   }

   unsubscribeAll() {
      this.subscribers.clear();
   }

   silently(callback) {
      this.notificationsSuspended = (this.notificationsSuspended || 0) + 1;
      let wasDirty = this.dirty, dirty;
      this.dirty = false;
      try {
         callback(this);
      }
      finally {
         this.notificationsSuspended--;
         dirty = this.dirty;
         this.dirty = wasDirty;
      }
      return dirty;
   }

   doNotify(path) {
      if (this.notificationsSuspended)
         return;

      if (!this.async) {
         this.subscribers.notify([path]);
      }
      else {
         this.changes.push(path || '');
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
}

Store.prototype.async = false;
