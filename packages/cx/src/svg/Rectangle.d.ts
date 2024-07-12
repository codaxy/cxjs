import * as Cx from '../core';
import {TextualBoundedObject, TextualBoundedObjectProps} from './TextualBoundedObject';

interface RectangleProps extends TextualBoundedObjectProps {

   /**
    * Index of the color in the default color palette. Setting this property will set
    * both fill and stroke on the object. Use `style` or a CSS class to remove stroke or fill
    * if they are not necessary.
    */
   colorIndex?: Cx.NumberProp,

   /** A color used to paint the box. */
   fill?: Cx.StringProp,

   /** A color used to paint the outline of the box. */
   stroke?: Cx.StringProp,

   /** Base CSS class to be applied to the element. Defaults to `rectangle`. */
   baseClass?: string;

   /**
    * The horizontal corner radius of the rect. Defaults to ry if it is specified.
    * Value type: <length>|<percentage>;
    * If unit is not specified, it defaults to `px`.
    */
   rx?: Cx.StringProp | Cx.NumberProp;

   /**
    * The vertical corner radius of the rect. Defaults to rx if it is specified.
    * Value type: <length>|<percentage>;
    * If unit is not specified, it defaults to `px`.
    */
   ry?: Cx.StringProp | Cx.NumberProp;
}

export class Rectangle extends Cx.Widget<RectangleProps> {}