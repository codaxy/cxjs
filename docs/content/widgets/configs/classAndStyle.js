import {Md} from '../../../components/Md';


export default {
   class: {
      type: 'string/object',
      alias: 'className',
      description: <cx><Md>
         Additional CSS class to be applied on the field. If an object is provided, all keys with
         "truthy" value will be added in the CSS class list.
      </Md></cx>
   },
   style: {
      type: 'string/object',
      description: <cx><Md>
         Style object applied to the wrapper div. Use for setting the dimensions of the field.
      </Md></cx>
   }
};

