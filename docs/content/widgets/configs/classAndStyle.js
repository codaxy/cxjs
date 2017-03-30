import {Md} from '../../../components/Md';


export default {
   class: {
      type: 'string/object',
      alias: 'className',
      description: <cx><Md>
         Additional CSS classes to be applied to the element. If an object is provided, all keys with a
         "truthy" value will be added to the CSS class list.
      </Md></cx>
   },
   style: {
      type: 'string/object',
      description: <cx><Md>
         Style object applied to the wrapper div. Used for setting the dimensions of the element.
      </Md></cx>
   }
};

