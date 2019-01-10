import {VDOM} from '../../ui/Widget';
import {registerIcon} from './registry';

export default registerIcon('file', props => {
   return <svg
      {...props}
      viewBox="0 0 16 16">
      <path d="M2 2h5v5h5v7H2z" fill="currentColor" stroke="none"/>
      <path d="M8 2v4h4z" fill="currentColor" stroke="none"/>
   </svg>
}, true);

