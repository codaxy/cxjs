type UnsubscribeFunction = () => void;
type Callback = (...args: any[]) => void;

export class SubscriberList {
   private subscriptions: { [key: string]: Callback };
   private freeSlots: string[];
   private nextSlot: number;
   private subscriptionCount: number;

   constructor() {
      this.clear();
   }

   private getSlot(): string {
      if (this.freeSlots.length)
         return this.freeSlots.pop()!;

      let slot = String(this.nextSlot++);
      return slot;
   }

   private recycle(slot: string, callback: Callback): void {
      if (this.subscriptions[slot] === callback) {
         this.freeSlots.push(slot);
         delete this.subscriptions[slot];
         this.subscriptionCount--;
      }
   }

   /**
    * Add a new subscription.
    * @param callback
    */
   subscribe(callback: Callback): UnsubscribeFunction {
      let slot = this.getSlot();
      this.subscriptions[slot] = callback;
      this.subscriptionCount++;
      return () => {
         this.recycle(slot, callback);
      }
   }

   /**
    * Clear all subscriptions.
    */
   clear(): void {
      this.subscriptions = {};
      this.freeSlots = [];
      this.nextSlot = 1;
      this.subscriptionCount = 0;
   }

   /**
    * Returns true if there are no subscribers.
    */
   isEmpty(): boolean {
      return this.subscriptionCount == 0;
   }

   /**
    * Returns an array of subscribed callbacks.
    */
   getSubscribers(): Callback[] {
      let result = [];
      for (let key in this.subscriptions)
         result.push(this.subscriptions[key]);
      return result;
   }

   /**
    * Trigger all subscribed callbacks with provided arguments.
    * @param args - Arguments that will be passed to callback functions.
    */
   notify(...args: any[]): void {
      for (let key in this.subscriptions)
         this.subscriptions[key](...args);
   }

   /**
    *
    * @param callback
    */
   execute(callback: (c: Callback) => void): void {
      for (let key in this.subscriptions)
         callback(this.subscriptions[key]);
   }
}