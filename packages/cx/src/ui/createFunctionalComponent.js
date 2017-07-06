import {createComponentFactory} from './Component';

export function createFunctionalComponent(factory) {
   return createComponentFactory((...args) => {
      let props = args[0];

      //test if the component is invoked through JSX
      if (args.length == 1 && props && Array.isArray(props.jsxAttributes)) {
         let result = factory(props);
         let isArray = Array.isArray(result);
         if (isArray && result.length < 2) {
            result = result[0];
            isArray = false;
         }
         let {visible, controller, layout, outerLayout} = props;
         if (props["if"] !== undefined)
            visible = props["if"];

         if (result) {
            if (isArray) {
               if (visible !== undefined)
                  result.forEach(r => {
                     if (r.visible !== undefined)
                        throw new Error('Functional components with defined visible property should not set visibility on its children.');

                     r.visible = visible
                  });

               if (controller || outerLayout || layout)
                  throw new Error('Functional components returning multiple elements cannot use controller, outerLayout and layout properties. Consider wrapping the content inside a PureContainer.');
            }
            else {
               if (visible !== undefined)
                  result.visible = visible;

               if (controller !== undefined)
                  result.controller = controller;

               if (layout !== undefined)
                  result.layout = layout;

               if (outerLayout !== undefined)
                  result.outerLayout = outerLayout;
            }
         }

         return result;
      }

      return factory(...args);
   });
}
