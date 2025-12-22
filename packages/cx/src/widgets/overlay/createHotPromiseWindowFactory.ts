import { Store } from "../../data/Store";
import { HotModule } from "../../ui/app/startHotAppLoop";
import { SubscriberList } from "../../util/SubscriberList";
import { Window } from "./Window";
import { View } from "../../data/View";
import { Instance } from "../../ui/Instance";
import { Overlay } from "./Overlay";

export interface HotPromiseWindowFactoryOptions {
   parent?: Instance;
   store?: View;
}

export function createHotPromiseWindowFactoryWithProps<Props, R = any>(
   module: HotModule,
   factory: (props: Props) => (resolve: (value: R | PromiseLike<R>) => void, reject: (reason?: any) => void) => Overlay,
): (props: Props, options?: HotPromiseWindowFactoryOptions) => Promise<R> {
   let subscriberList: SubscriberList | undefined;
   if (module.hot) {
      if (module.hot.data?.subscriberList) subscriberList = module.hot.data.subscriberList;
      if (!subscriberList) subscriberList = new SubscriberList();

      module.hot.dispose((data: any) => {
         data.subscriberList = subscriberList;
      });

      module.hot.accept();

      if (!subscriberList.isEmpty()) subscriberList.notify(factory);

      subscriberList.subscribe((updatedFactory) => {
         factory = updatedFactory;
      });
   }

   return (props: Props, options?: HotPromiseWindowFactoryOptions): Promise<R> => {
      let store = options?.parent ?? options?.store ?? new Store();
      let reloading = false;
      return new Promise<R>((resolve, reject) => {
         let dismiss: (() => void) | undefined;
         let unsubscribe: (() => void) | undefined;
         function rerun() {
            dismiss?.();
            let window = Window.create(factory(props)(resolve, reject) as any) as any;
            window.overlayWillDismiss = () => {
               if (!reloading && unsubscribe) unsubscribe();
            };
            dismiss = window.open(store);
         }
         unsubscribe = subscriberList?.subscribe((updatedFactory: any) => {
            factory = updatedFactory;
            setTimeout(() => {
               // timeout is required for proper module initialization
               // sometimes elements are defined in the lower part of the module and if the function is run immediately, it will fail
               reloading = true;
               rerun();
               reloading = false;
            }, 10);
         });
         rerun();
      });
   };
}

export function createHotPromiseWindowFactory<R = any>(
   module: HotModule,
   factory: (resolve: (value: R | PromiseLike<R>) => void, reject: (reason?: any) => void) => Overlay,
): (options?: HotPromiseWindowFactoryOptions) => Promise<R> {
   let result = createHotPromiseWindowFactoryWithProps(module, () => factory);
   return (options?: HotPromiseWindowFactoryOptions) => result(null, options);
}
