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

   addTrigger<V1>(name: string, args: [Cx.AccessorChain<V1>], callback: (v1: V1) => void, autoRun?: boolean): void;
   addTrigger<V1, V2>(
      name: string,
      args: [Cx.AccessorChain<V1>, Cx.AccessorChain<V2>],
      callback: (v1: V1, v2: V2) => void,
      autoRun?: boolean
   ): void;
   addTrigger<V1, V2, V3>(
      name: string,
      args: [Cx.AccessorChain<V1>, Cx.AccessorChain<V2>, Cx.AccessorChain<V3>],
      callback: (v1: V1, v2: V2, v3: V3) => void,
      autoRun?: boolean
   ): void;
   addTrigger<V1, V2, V3, V4>(
      name: string,
      args: [Cx.AccessorChain<V1>, Cx.AccessorChain<V2>, Cx.AccessorChain<V3>, Cx.AccessorChain<V4>],
      callback: (v1: V1, v2: V2, v3: V3, v4: V4) => void,
      autoRun?: boolean
   ): void;

   addTrigger(
      name: string,
      args: (string | Cx.AccessorChain<any>)[],
      callback: (...args) => void,
      autoRun?: boolean
   ): void;

   addComputable<V1, R>(path: Cx.AccessorChain<R>, args: [Cx.AccessorChain<V1>], callback: (v1: V1) => R): void;
   addComputable<V1, V2, R>(
      path: Cx.AccessorChain<R>,
      args: [Cx.AccessorChain<V1>, Cx.AccessorChain<V2>],
      callback: (v1: V1, v2: V2) => R
   ): void;
   addComputable<V1, V2, V3, R>(
      path: Cx.AccessorChain<R>,
      args: [Cx.AccessorChain<V1>, Cx.AccessorChain<V2>, Cx.AccessorChain<V3>],
      callback: (v1: V1, v2: V2, v3: V3) => R
   ): void;
   addComputable<V1, V2, V3, V4, R>(
      path: Cx.AccessorChain<R>,
      args: [Cx.AccessorChain<V1>, Cx.AccessorChain<V2>, Cx.AccessorChain<V3>, Cx.AccessorChain<V4>],
      callback: (v1: V1, v2: V2, v3: V3, v4: V4) => R
   ): void;

   addComputable(path: string, args: (string | Cx.AccessorChain<any>)[], callback: (...args) => any): void;

   removeTrigger(name: string): void;

   removeComputable(name: string): void;
}
