import * as Cx from '../core';
import {TextualBoundedObject, TextualBoundedObjectProps} from './TextualBoundedObject';

interface LineProps extends TextualBoundedObjectProps {
   
   /** 
    * Index of the color in the default color palette. Setting this property will set 
    * both fill and stroke on the object. Use `style` or a CSS class to remove stroke or fill 
    * if they are not necessary. 
    */
   colorIndex?: Cx.NumberProp,
   
   /** A color used to paint the outline of the box. */
   stroke?: Cx.StringProp,

   /** Base CSS class to be applied to the element. Defaults to `line`. */
   baseClass?: string

}

export class Line extends Cx.Widget<LineProps> {}