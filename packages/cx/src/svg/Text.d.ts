import * as Cx from '../core';
import {BoundedObject, BoundedObjectProps} from './BoundedObject';

interface TextProps extends BoundedObjectProps {
   
   /** Text to be displayed. */
   value?: Cx.StringProp,

   /** Offset along the x-axis. */
   dx?: Cx.StringProp,

   /** 
    * Offset along the y-axis. This property is commonly used for vertical text alignment. 
    * Set dy="0.8em" to align the text with the top and dy="0.4em" to center it vertically. 
    */
   dy?: Cx.StringProp,

   /** Used for horizontal text alignment. Accepted values are `start`, `middle` and `end`. */
   textAnchor?: Cx.StringProp,

   /** Used for horizontal text alignment. Accepted values are `start`, `middle` and `end`. */
   ta?: Cx.StringProp,

   /** Sets text-body color. */
   fill?: Cx.StringProp,

   /** Sets text-outline color. */
   stroke?: Cx.StringProp,

   /** Base CSS class to be applied to the element. Defaults to `text`. */
   baseClass?: string
   
}

export class Text extends Cx.Widget<TextProps> {}