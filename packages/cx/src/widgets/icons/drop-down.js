import {VDOM} from '../../ui/Widget';
import {registerIcon} from './registry';

export default registerIcon('drop-down', props => {
   return <svg
      {...props}
      viewBox="0 0 20 20">
      <path fill="currentColor"
            strokeWidth="0"
            stroke="currentColor"
            d="M4.516 8.147L10.01 12.5l5.474-4.33-.473-.65-5 3.98-5-4z"/>
   </svg>
}, true);

