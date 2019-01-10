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
    * Returns an array of subscribed callbacks.
    */
   getSubscribers() : Callback[];


   /**
    * Returns true if there are no subscribers.
    */
   isEmpty() : boolean;

   /** 
    * Trigger all subscribed callbacks with provided arguments.
    * @param args - Arguments that will be passed to callback functions.
    */
   notify(...args: any[]);

   /**
    * 
    * @param callback
    */
   execute(callback: (c: Callback) => void);

}