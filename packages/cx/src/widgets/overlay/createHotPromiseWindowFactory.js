import { Store } from "../../data/Store";
import { SubscriberList } from "../../util/SubscriberList";
import { Window } from "./Window";

export function createHotPromiseWindowFactoryWithProps(module, factory) {
   let subscriberList;
   if (module.hot) {
      if (module.hot.data?.subscriberList) subscriberList = module.hot.data.subscriberList;
      if (!subscriberList) subscriberList = new SubscriberList();

      module.hot.dispose((data) => {
         data.subscriberList = subscriberList;
      });

      module.hot.accept();

      if (!subscriberList.isEmpty()) subscriberList.notify(factory);

      subscriberList.subscribe((updatedFactory) => {
         factory = updatedFactory;
      });
   }

   return (props, options) => {
      let store = options?.parent ?? options?.store ?? new Store();
      let reloading = false;
      return new Promise((resolve, reject) => {
         let dismiss;
         let unsubscribe;
         function rerun() {
            dismiss?.();
            let window = Window.create(factory(props)(resolve, reject));
            window.overlayWillDismiss = () => {
               if (!reloading) unsubscribe();
            };
            dismiss = window.open(store);
         }
         unsubscribe = subscriberList?.subscribe((updatedFactory) => {
            reloading = true;
            factory = updatedFactory;
            rerun();
            reloading = false;
         });
         rerun();
      });
   };
}

export function createHotPromiseWindowFactory(module, factory) {
   let result = createHotPromiseWindowFactoryWithProps(module, () => factory);
   return (options) => result(null, options);
}
