import {createComponentFactory} from './Component';
import {flattenProps} from '../ui/flattenProps';
import {isDefined} from '../util/isDefined';
import {isArray} from '../util/isArray';

export function createFunctionalComponent(factory) {
   return createComponentFactory((...args) => {
      let props = args[0];

      //test if the component is invoked through JSX
      if (props && isArray(props.jsxAttributes)) {
         let result = factory(flattenProps(props));
         let isArr = isArray(result);
         if (isArr && result.length < 2) {
            result = result[0];
            isArr = false;
         }
         let {visible, controller, layout, outerLayout} = props;
         if (props["if"] !== undefined)
            visible = props["if"];

         if (result) {
            if (isArr) {
               if (isDefined(visible))
                  result.forEach(r => {
                     if (isDefined(r.visible))
                        throw new Error('Functional components with defined visible property should not set visibility on its children.');

                     r.visible = visible
                  });

               if (controller || outerLayout || layout)
                  throw new Error('Functional components returning multiple elements cannot use controller, outerLayout and layout properties. Consider wrapping the content inside a PureContainer.');
            }
            else {
               if (isDefined(visible))
                  result.visible = visible;

               if (isDefined(controller))
                  result.controller = controller;

               if (isDefined(layout))
                  result.layout = layout;

               if (isDefined(outerLayout))
                  result.outerLayout = outerLayout;
            }
         }

         return result;
      }

      return factory(...args);
   });
}
