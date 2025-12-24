import { Widget } from "../ui/Widget";
import { PureContainerBase, PureContainerConfig } from "../ui/PureContainer";
import { Binding, BindingInput } from "../data/Binding";
import { ExposedValueView, ExposedValueViewConfig } from "../data/ExposedValueView";
import { RenderingContext } from "../ui/RenderingContext";
import { Instance } from "../ui/Instance";
import { StringProp, WritableProp } from "../ui/Prop";

export interface SandboxConfig extends PureContainerConfig {
   /** Binding to the object that holds sandbox data. */
   storage: WritableProp<Record<string, any>>;

   /** Key used to identify the sandbox instance within the storage. */
   key?: StringProp;

   /** Alias for `key`. */
   accessKey?: StringProp;

   /** Alias used to expose sandbox data. Default is `$page`. */
   recordName?: string;

   /** Alias for `recordName`. */
   recordAlias?: string;

   /** Indicate that parent store data should not be mutated. */
   immutable?: boolean;

   /** Indicate that sandbox store data should not be mutated. */
   sealed?: boolean;
}

export interface SandboxInstance extends Instance {
   store: ExposedValueView;
}

export class Sandbox extends PureContainerBase<SandboxConfig, SandboxInstance> {
   declare storage: WritableProp<Record<string, any>>;
   declare key?: StringProp;
   declare recordName?: string;
   declare recordAlias?: string;
   declare accessKey?: StringProp;
   declare immutable?: boolean;
   declare sealed?: boolean;
   declare storageBinding: Binding;
   init(): void {
      if (this.recordAlias) this.recordName = this.recordAlias;

      if (this.accessKey) this.key = this.accessKey;

      this.storageBinding = Binding.get(this.storage);

      super.init();
   }

   initInstance(context: RenderingContext, instance: SandboxInstance): void {
      instance.store = new ExposedValueView({
         store: instance.parentStore,
         containerBinding: this.storageBinding,
         key: null,
         recordName: this.recordName,
         immutable: this.immutable,
      });
      super.initInstance(context, instance);
   }

   applyParentStore(instance: SandboxInstance): void {
      instance.store.setStore(instance.parentStore);
   }

   declareData(...args: Record<string, unknown>[]): void {
      super.declareData(
         {
            storage: undefined,
            key: undefined,
         },
         ...args,
      );
   }

   prepareData(context: RenderingContext, instance: SandboxInstance): void {
      var { store, data } = instance;
      if (store.getKey() !== data.key) {
         //when navigating to a page using the same widget tree as the previous page
         //everything needs to be reinstantiated, e.g. user/1 => user/2
         instance.store = new ExposedValueView({
            store: store,
            containerBinding: this.storageBinding,
            key: data.key,
            recordName: this.recordName,
            immutable: this.immutable,
            sealed: this.sealed,
         });
         instance.clearChildrenCache();
      }
      super.prepareData(context, instance);
   }
}

Sandbox.prototype.recordName = "$page";
Sandbox.prototype.immutable = false;
Sandbox.prototype.sealed = false;

Widget.alias("sandbox", Sandbox);
