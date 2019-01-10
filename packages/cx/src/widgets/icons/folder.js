import {VDOM} from '../../ui/Widget';
import {registerIcon} from './registry';

export default registerIcon('folder', props => {
   return <svg
      {...props}
      viewBox="0 0 16 16">

      <path d="M1 5h13v9H1zm1 0h6L7 3H3z" fill="currentColor" stroke="none"/>
   </svg>
}, true);

