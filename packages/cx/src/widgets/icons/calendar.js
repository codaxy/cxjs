import {VDOM} from '../../ui/Widget';
import {registerIcon} from './registry';

export default registerIcon('calendar', props => {
   return <svg
      {...props}
      viewBox="0 0 32 32">

      <path d="M4 3h6m10 0h6" fill="none" stroke="currentColor" strokeWidth="2"/>
      <path d="M19 21h4v4h-4z" fill="currentColor"/>
      <path d="M3 25h24M3 21h24M3 17h24M7 28V13m-4 0h24M11 28V13.2M15 28V13.27M19 28V13.03M23 28V13.5" fill="none" stroke="currentColor"/>
      <path fill="currentColor" d="M10 8h10v2H10z"/>
      <path fill="none" stroke="currentColor" strokeWidth="2" d="M3 5h24v24H3z"/>
   </svg>
}, true);

