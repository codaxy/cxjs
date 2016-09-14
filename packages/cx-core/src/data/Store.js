import {Binding} from './Binding';
import {View} from './View';

export class Store extends View {
   constructor(config = {}) {
      super();
      this.data = config.data || {};
      this.subscriptions = {};
      this.subscriptionKey = 0;
      this.changes = [];
   }

   getData() {
      return this.data;
   }

   set(path, value) {
      var next = Binding.get(path).set(this.data, value);
      if (next != this.data) {
         this.data = next;
         this.notify(path);
      }
   }
   
   delete(path) {
      var next = Binding.get(path).delete(this.data);
      if (next != this.data) {
         this.data = next;
         this.notify(path);
      }
   }
   
   clear() {
      this.data = {};
      this.notify();
   }

   subscribe(callback) {
      var key = ++this.subscriptionKey;
      this.subscriptions[key] = callback;
      return () => delete this.subscriptions[key];
   }

   unsubscribeAll() {
      this.subscriptions = {};
   }

   doNotify(path) {
      this.changes.push(path || '');
      if (!this.scheduled) {
         this.scheduled = true;
         setTimeout(()=> {
            this.scheduled = false;
            var changes = this.changes;
            this.changes = [];
            for (var key in this.subscriptions)
               this.subscriptions[key](changes);
         }, 0);
      }
   }
}
