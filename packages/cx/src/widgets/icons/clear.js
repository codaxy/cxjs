import {VDOM} from '../../ui/Widget';
import {registerIcon} from './registry';

export default registerIcon('clear', props => {
   return <svg
      {...props}
      viewBox="0 0 32 32">
      <path fill="currentColor"
            strokeWidth="1"
            stroke="currentColor"
            d="M16.9 16l4.92-4.92c.24-.24.24-.6 0-.84s-.6-.24-.84 0l-4.92 4.92-5.04-4.98c-.24-.24-.6-.24-.84 0s-.24.6 0 .84L15.16 16l-4.98 4.98c-.24.24-.24.6 0 .84s.6.24.84 0L16 16.84l4.98 4.98c.24.24.6.24.84 0s.24-.6 0-.84L16.9 16z"/>
   </svg>
}, true);

