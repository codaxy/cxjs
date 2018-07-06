import {createComponentFactory} from './Component';
import {flattenProps} from '../ui/flattenProps';
import {isDefined} from '../util/isDefined';
import {isArray} from '../util/isArray';
import {PureContainer} from "./PureContainer";
import {UseParentLayout} from "./layout/UseParentLayout";

export function createFunctionalComponent(factory) {
   return createComponentFactory((...args) => {
      let props = args[0];
      
      //test if the component is invoked through JSX
      if (props && isArray(props.jsxAttributes || props.jsxSpread)) {
         let result = factory(flattenProps(props));
         if (isArray(result) && result.length < 2) {
            result = result[0];
         }
         let {visible, controller, layout, outerLayout, putInto, contentFor} = props;
         if (props["if"] !== undefined)
            visible = props["if"];

         if (result && (isDefined(visible) || controller || outerLayout || layout || putInto || contentFor)) {
            result = {
               type: PureContainer,
               visible,
               controller,
               outerLayout,
               layout: layout || UseParentLayout,
               children: result,
               putInto,
               contentFor
            };
         }

         return result;
      }

      return factory(...args);
   });
}
