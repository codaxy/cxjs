import {VDOM} from '../../ui/Widget';
import {registerIcon} from './registry';

export default registerIcon('loading', props => {
   let style = {
      animation: 'linear infinite 0.5s cx-rotate'
   };

   if (props && props.style)
      Object.assign(style, props.style);

   props = {
      ...props,
      style
   };

   return <svg
      {...props}
      viewBox="0 0 50 50">
      <path fill="currentColor" d="M43.94 25.14c0-10.3-8.37-18.68-18.7-18.68-10.3 0-18.67 8.37-18.67 18.68h4.07c0-8.07 6.54-14.6 14.6-14.6 8.08 0 14.63 6.53 14.63 14.6h4.07z" />
   </svg>
}, true);

