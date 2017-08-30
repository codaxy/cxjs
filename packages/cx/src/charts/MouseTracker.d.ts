import * as Cx from '../core';
import { BoundedObjectProps } from '../svg/BoundedObject';

interface MouseTrackerProps extends BoundedObjectProps {
   
   /** The binding that is used to store the mouse x coordinate. */
   x?: Cx.NumberProp,

   /** The binding that is used to store the mouse y coordinate. */
   y?: Cx.NumberProp,
   
   /** Base CSS class to be applied to the element. Defaults to `mousetracker`. */
   baseClass?: string

}

export class MouseTracker extends Cx.Widget<MouseTrackerProps> {}