type UnsubscribeFunction = () => void;
type Callback = (...args: any[]) => void;

export class SubscriberList {

   constructor();

   /**
    * Add a new subscription.
    * @param callback 
    */
   subscribe(callback: Callback) : UnsubscribeFunction;

   /**
    * Clear all subscriptions.
    */
   clear();

   /**
    * Returns a an array of subscribed callbacks.
    */
   getSubscribers() : Callback[];

   /** 
    * Trigger all subscribed callbacks with provided arguments.
    * @param {...any} args - Arguments that will be passed to callback functions.
    */
   notify(...args: any[]);

   /**
    * 
    * @param {Function} callback
    */
   execute(callback: (c: Callback) => void);

}