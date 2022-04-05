import * as Cx from "../core";

import { View } from "../data/View";

export class Controller<D = any> {
   onInit?(): void;

   onExplore?(context?): void;

   onPrepare?(context?): void;

   onCleanup?(context?): void;

   onDestroy?(): void;

   init?(): void;

   store: View<D>;
   widget: any;

   addTrigger(
      name: string,
      args: (string | Cx.AccessorChain<any>)[],
      callback: (...args) => void,
      autoRun?: boolean
   ): void;

   addComputable(name: string, args: string[], callback: (...args) => any): void;

   removeTrigger(name: string): void;

   removeComputable(name: string): void;
}
