import { Store } from "cx/data";
import { SubscriberList } from "cx/util";
import { Button, Window } from "cx/widgets";

function registerHotPromiseWindow(module, factory) {
   let subscriberList;
   if (module.hot) {
      module.hot.accept();
      module.hot.dispose((data) => {
         data.subscriberList = subscriberList;
      });

      if (module.hot.data?.subscriberList) {
         subscriberList = module.hot.data.subscriberList;
      }

      if (!subscriberList) subscriberList = new SubscriberList();
      else subscriberList.notify(factory);

      subscriberList.subscribe((updatedFactory) => {
         factory = updatedFactory;
      });
   }

   let reloading = false;
   function restart(store, resolve, reject, factory, unsubscribe) {
      let window = Window.create(factory(resolve, reject));
      window.overlayWillDismiss = () => {
         if (!reloading) unsubscribe?.();
      };
      return window.open(store);
   }

   return (store) => {
      if (!store) store = new Store();
      return new Promise((resolve, reject) => {
         reloading = true;
         let unsubscribe = subscriberList?.subscribe((updatedFactory) => {
            dismiss();
            dismiss = restart(store, resolve, reject, updatedFactory, unsubscribe);
         });
         let dismiss = restart(store, resolve, reject, factory, unsubscribe);
         reloading = false;
      });
   };
}

let getInfo2 = registerHotPromiseWindow(module, (resolve, reject) => {
   let result = null;
   return Window.create({
      title: "Hello",
      onDestroy: () => resolve(result),
      children: (
         <cx>
            <div>Text1234567917891122</div>
            <Button
               onClick={async () => {
                  let result = await getInfo2();
                  console.log(result);
               }}
            >
               One more
            </Button>
         </cx>
      ),
   });
});

function getInfo() {
   return new Promise((resolve, reject) => {
      let result = null;
      let window = Window.create({
         title: "Hello",
         onDestroy: () => resolve(result),
         children: (
            <cx>
               <div>Text12345</div>
            </cx>
         ),
      });
      let store = new Store();
      window.open(store);
   });
}

export default (
   <cx>
      <Button
         onClick={async (e, { store }) => {
            let result = await getInfo();
            console.log(result);
         }}
         text="Open Modal Window"
      />

      <Button
         onClick={async (e, { store }) => {
            let result = await getInfo2();
            console.log(result);
         }}
         text="Open Hot Modal Window"
      />
   </cx>
);
