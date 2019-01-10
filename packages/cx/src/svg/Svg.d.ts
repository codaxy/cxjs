import * as Cx from '../core';
import {BoundedObject, BoundedObjectProps} from './BoundedObject';

interface SvgProps extends BoundedObjectProps {

   /** Set to `true` to automatically calculate width based on the measured height and `aspectRatio`. */
   autoWidth?: boolean,

   /** Set to `true` to automatically calculate height based on the measured width and `aspectRatio`. */
   autoHeight?: boolean,

   /**
    * Aspect ratio of the the SVG element. Default value is `1.618`. 
    * This value doesn't have any effect unless `autoWidth` or `autoHeight` is set.
    */
   aspectRatio?: number,

   /** Base CSS class to be applied to the element. Defaults to `svg`. */
   baseClass?: string

}

// no new props defined in ClipRect, so inheriting BoundedObject directly
export class Svg extends Cx.Widget<SvgProps> {}