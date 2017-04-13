import {VDOM} from '../../ui/Widget';
import {registerIcon} from './registry';

export default registerIcon('folder-open', props => {
   return <svg
      {...props}
      viewBox="0 0 16 16">

      <path d="M0 5v7l2.5-6H13V5zm1 0h6L6 3H2z" fill="currentColor" stroke="none"/>
      <path d="M3 7h13l-3 7H0z" fill="currentColor" stroke="none"/>

   </svg>
}, true);

