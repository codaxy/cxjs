import {createComponentFactory} from '../util/Component';
import {flattenProps} from '../ui/flattenProps';
import {isArray} from '../util/isArray';
import {PureContainer} from "./PureContainer";
import {UseParentLayout} from "./layout/UseParentLayout";

class FunctionalComponent extends PureContainer {
   initInstance(context, instance) {
      this.add(this.childrenFactory({...this.props, store: instance.store }));
      instance.widgets = this.items;
      this.clear();
   }

   explore(context, instance) {
      this.exploreItems(context, instance, instance.widgets);
   }
}

export function createFunctionalComponent(factory) {
   return createComponentFactory((...args) => {
      let props = args[0];

      //test if the component is invoked through JSX
      if (props && isArray(props.jsxAttributes || props.jsxSpread)) {
         let innerProps = flattenProps(props);
         delete innerProps.visible;
         delete innerProps.if;
         delete innerProps.controller;
         delete innerProps.layout;
         delete innerProps.outerLayout;
         delete innerProps.putInto;
         delete innerProps.contentFor;

         return {
            layout: UseParentLayout, //default value
            ...props,
            $type: FunctionalComponent,
            type: FunctionalComponent,
            childrenFactory: factory,
            props: innerProps
         };
      }

      return factory(...args);
   });
}
