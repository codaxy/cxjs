import {VDOM} from '../../ui/Widget';
import {registerIcon} from './registry';

export default registerIcon('sort-asc', props => {
   return <svg
      {...props}
      viewBox="0 0 16 16">
      <path fill="currentColor"
         d="M10.5 5.8l-3-3-3 3 .707.708L7 4.688v8.312h1V4.69l1.793 1.817z"
      />
   </svg>
}, true);

