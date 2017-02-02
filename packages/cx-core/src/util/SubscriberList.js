export class SubscriberList {
   constructor() {
      this.clear();
   }

   getSlot() {
      if (this.freeSlots.length)
         return this.freeSlots.pop();

      let slot = String(this.nextSlot++);
      return slot;
   }

   recycle(slot, callback) {
      if (this.subscriptions[slot] === callback) {
         this.freeSlots.push(slot);
         delete this.subscriptions[slot];
      }
   }

   subscribe(callback) {
      let slot = this.getSlot();
      this.subscriptions[slot] = callback;
      return () => {
         this.recycle(slot, callback);
      }
   }

   clear() {
      this.subscriptions = {};
      this.freeSlots = [];
      this.nextSlot = 1;
   }

   getSubscribers() {
      let result = [];
      for (let key in this.subscriptions)
         result.push(this.subscriptions[key]);
      return result;
   }

   notify() {
      for (let key in this.subscriptions)
         this.subscriptions[key](...arguments);
   }

   execute(callback) {
      for (let key in this.subscriptions)
         callback(this.subscriptions[key]);
   }
}