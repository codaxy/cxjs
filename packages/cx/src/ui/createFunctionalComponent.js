import {createComponentFactory, isComponentFactory} from '../util/Component';
import {flattenProps} from '../ui/flattenProps';
import {PureContainer} from "./PureContainer";
import {UseParentLayout} from "./layout/UseParentLayout";
import {StoreProxy} from "../data/StoreProxy";
import {isDefined} from "../util/isDefined";

class FunctionalComponent extends PureContainer {
   initInstance(context, instance) {
      this.clear();
      this.add(this.childrenFactory({
         ...this.props,
         store: new StoreProxy(() => instance.store)
      }));
      instance.content = this.layout ? this.layout.items : this.items;
      this.clear();
   }

   explore(context, instance) {
      if (this.layout)
         this.layout.items = instance.content;
      else
         this.items = instance.content;
      this.exploreItems(context, instance, instance.content);
   }
}

export function createFunctionalComponent(factory) {
   if (isComponentFactory(factory))
      return factory;

   return createComponentFactory(
      factory,
      (props = {}) => {
         let innerProps = flattenProps(props);
         delete innerProps.visible;
         delete innerProps.if;
         delete innerProps.controller;
         delete innerProps.layout;
         delete innerProps.outerLayout;
         delete innerProps.putInto;
         delete innerProps.contentFor;

         return {
            type: FunctionalComponent,
            visible: isDefined(props.if) ? props.if : isDefined(props.visible) ? props.visible: true,
            layout: props.layout || UseParentLayout,
            controller: props.controller,
            outerLayout: props.outerLayout,
            putInto: props.contentFor || props.putInto,
            childrenFactory: factory,
            props: innerProps
         };
      }
   )
}
