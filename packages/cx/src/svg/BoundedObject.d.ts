import * as Cx from '../core';
//import {PureContainer} from '../ui/PureContainer';
import {Rect} from './util/Rect';

export interface BoundedObjectProps extends Cx.StyledContainerProps {
   
   /**
    * Anchor defines how child bounds are tied to the parent. Zero aligns with the top/left edge. 
    * One aligns with the bottom/right edge. See Svg for more information.
    */
   anchors?: Cx.Prop<string | number | Rect>,
   
   /** Move boundaries specified by the offset. See Svg for more information. */
   offset?: Cx.Prop<string | number | Rect>,

   /** Apply margin to the given boundaries. See Svg for more information. */
   margin?: Cx.Prop<string | number | Rect>,

   /** Padding to be applied to the boundaries rectangle before passing to the children. */
   padding?: Cx.Prop<string | number | Rect>,

   pure?: boolean
}

export class BoundedObject extends Cx.Widget<BoundedObjectProps> {}