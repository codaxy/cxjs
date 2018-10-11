import {createComponentFactory, isComponentFactory} from '../util/Component';
import {flattenProps} from '../ui/flattenProps';
import {isArray} from '../util/isArray';
import {PureContainer} from "./PureContainer";
import {UseParentLayout} from "./layout/UseParentLayout";

class FunctionalComponent extends PureContainer {
   initInstance(context, instance) {
      this.add(this.childrenFactory({...this.props, store: instance.store }));
   }
}

export function createFunctionalComponent(factory) {
   if (isComponentFactory(factory))
      return factory;

   return createComponentFactory(
      factory,
      props => {
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
            children: null,
            items: null,
            childrenFactory: factory,
            props: innerProps
         };
      }
   )
}
