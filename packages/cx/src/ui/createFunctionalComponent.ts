import { flattenProps } from "../ui/flattenProps";
import { createComponentFactory, isComponentFactory } from "../util/Component";
import { isDefined } from "../util/isDefined";
import { ChildNode } from "./Container";
import { PureContainerBase, PureContainerConfig } from "./PureContainer";
import { UseParentLayout } from "./layout/UseParentLayout";

let currentInstance: any = null;

export interface FunctionalComponentConfig extends PureContainerConfig {
   /** Factory function that creates children based on props. */
   childrenFactory?: (props: any) => ChildNode | ChildNode[];

   /** Props passed to the children factory. */
   props?: any;
}

class FunctionalComponent extends PureContainerBase<FunctionalComponentConfig> {
   declare childrenFactory: (props: any) => any;
   declare props: any;

   constructor(config?: FunctionalComponentConfig) {
      super(config);
   }

   initInstance(context: any, instance: any) {
      instance.store = instance.parentStore;
      this.clear();
      currentInstance = instance;
      this.add(this.childrenFactory(this.props));
      instance.content = this.layout ? this.layout.items : this.items;
      this.clear();
      currentInstance = null;
   }

   explore(context: any, instance: any) {
      if (this.layout) this.layout.items = instance.content;
      else this.items = instance.content;
      this.exploreItems(context, instance, instance.content);
      if (instance.computables) {
         instance.computables.forEach((cb: any) => cb(instance.store.getData()));
      }
   }
}

export function createFunctionalComponent<Props = any>(
   factory: (props: Props) => ChildNode | ChildNode[],
): (props: Props & PureContainerConfig) => any {
   if (isComponentFactory(factory)) return factory as any;

   return createComponentFactory(factory, (props: any = {}) => {
      let innerProps = flattenProps(props);
      delete innerProps.visible;
      delete innerProps.if;
      delete innerProps.controller;
      delete innerProps.layout;
      delete innerProps.outerLayout;
      delete innerProps.putInto;
      delete innerProps.contentFor;
      delete innerProps.jsxAttributes;
      delete innerProps.$type;
      delete innerProps.vdomKey;

      return {
         type: FunctionalComponent,
         visible: isDefined(props.if) ? props.if : isDefined(props.visible) ? props.visible : true,
         layout: props.layout || UseParentLayout,
         controller: props.controller,
         outerLayout: props.outerLayout,
         putInto: props.contentFor || props.putInto,
         vdomKey: props.vdomKey,
         childrenFactory: factory,
         props: innerProps,
      };
   });
}

export function getCurrentInstance() {
   return currentInstance;
}
