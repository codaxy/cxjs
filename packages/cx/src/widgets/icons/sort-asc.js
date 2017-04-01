import {VDOM} from '../../ui/Widget';
import {Icon} from '../Icon';

export default Icon.register('sort-asc', props => {
   return <svg
      {...props}
      viewBox="0 0 16 16">
      <path fill="currentColor"
         d="M4.5 10.2l3 3 3-3-.7-.7L8 11.3V3H7v8.3L5.2 9.5z"/>
   </svg>
}, true);

