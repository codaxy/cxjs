import { PureContainer } from "./PureContainer";
import { isArray } from "../util/isArray";

export class IsolatedScope extends PureContainer {
   declareData() {
      return super.declareData(...arguments, {
         data: { structured: true },
      });
   }

   init() {
      if (typeof this.bind === "string") this.data = { bind: this.bind };
      else if (isArray(this.bind)) {
         this.data = {};
         this.bind.forEach((x, i) => {
            this.data[String(i)] = { bind: x };
         });
      }
      super.init();
   }

   explore(context, instance) {
      if (instance.shouldUpdate) {
         super.explore(context, instance);
      } else if (instance.children) {
         // mark children to prevent sweeping them away
         for (let i = 0; i < instance.children.length; i++) instance.instanceCache.addChild(instance.children[i]);
      }
   }
}
