import { PureContainerBase, PureContainerConfig } from "./PureContainer";
import { isArray } from "../util/isArray";
import { Instance } from "./Instance";
import { StructuredProp } from "./Prop";

export interface IsolatedScopeConfig extends PureContainerConfig {
   /**
    * A single binding path or a list of paths to be monitored for changes.
    * Use `bind` as a shorthand for defining the `data` object.
    */
   bind?: string | string[];

   /** Data object selector. The children will update only if `data` change. */
   data?: StructuredProp;
}

export class IsolatedScope<
   Config extends IsolatedScopeConfig = IsolatedScopeConfig,
   InstanceType extends Instance = Instance,
> extends PureContainerBase<Config, InstanceType> {
   declare bind?: string | string[];
   declare data?: StructuredProp;

   declareData(...args: any[]) {
      return super.declareData(...args, {
         data: { structured: true },
      });
   }

   init() {
      if (typeof this.bind === "string") this.data = { bind: this.bind };
      else if (isArray(this.bind)) {
         let data: Record<string, any> = {};
         this.bind.forEach((x, i) => {
            data[String(i)] = { bind: x };
         });
         this.data = data;
      }
      super.init();
   }

   explore(context: any, instance: any) {
      if (instance.shouldUpdate) {
         super.explore(context, instance);
      } else if (instance.children) {
         // mark children to prevent sweeping them away
         for (let i = 0; i < instance.children.length; i++) instance.instanceCache.addChild(instance.children[i]);
      }
   }
}
