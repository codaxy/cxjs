import {Md} from '../../../components/Md';

export default {
   visible: {
      type: 'boolean',
      alias: 'if',
      description: <cx><Md>
         If `visible` is set to `false`, the function defining the functional component
         will not be executed, nor its controller will be initialized. For this reason, another name should be used if child elements depend on its value.
      </Md></cx>
   },
   controller: {
      type: 'controller',
      description: <cx><Md>
         Controller passed to a functional component will automatically be initialized, as with any other component.
      </Md></cx>
   },
   outerLayout: {
      type: 'widget',
      description: <cx><Md>
         Defines the outer layout which wraps the functional component.
      </Md></cx>
   },
   layout: {
      type: 'widget',
      description: <cx><Md>
         Defines the [inner layout](~/concepts/inner-layouts) that will be applied to child elements.
      </Md></cx>
   }
};
