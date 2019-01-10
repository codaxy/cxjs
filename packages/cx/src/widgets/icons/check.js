import {VDOM} from '../../ui/Widget';
import {registerIcon} from './registry';

export default registerIcon('check', props => {
   return <svg
      {...props}
      viewBox="0 0 64 64">
      <path d="M7.136 42.94l20.16 14.784 29.568-40.32-9.72-7.128-22.598 30.816-10.44-7.656z"
            fill="currentColor"/>
   </svg>
}, true);

