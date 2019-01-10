import {VDOM} from '../../ui/Widget';
import {registerIcon} from './registry';

export default registerIcon('forward', props => {
   return <svg
      {...props}
      viewBox="0 0 20 20">

      <path fill="currentColor"
         strokeWidth="0"
         stroke="currentColor"
         d="M10.15 15.5L14.5 10l-4.33-5.47-.65.47 3.98 5-4 5z" />

      <path fill="currentColor"
         strokeWidth="0"
         stroke="currentColor"
         d="M6.15 15.5L10.5 10 6.17 4.53 5.52 5l3.98 5-4 5z" />

   </svg>
}, true);

