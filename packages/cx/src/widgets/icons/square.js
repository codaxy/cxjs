import {VDOM} from '../../ui/Widget';
import {registerIcon} from './registry';

export default registerIcon('square', props => {
   return <svg
      {...props}
      viewBox="0 0 64 64">
      <rect
         x="12"
         y="12"
         width="40"
         height="40"
         fill="currentColor"
      />
   </svg>
}, true);

