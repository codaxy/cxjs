import {VDOM} from '../../ui/Widget';
import {registerIcon} from './registry';

export default registerIcon('menu', props => {
   return <svg
      {...props}
      viewBox="0 0 24 24">

      <path d="M0 0h24v24H0z" 
            fill="none" />
      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
            fill="currentColor" />

   </svg>
}, true);

