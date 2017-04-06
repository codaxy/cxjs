import * as Cx from '../../core';

interface LabelProps extends Cx.HtmlElementProps{

   required?: boolean,
   disabled?: boolean,

   /** TODO: Check type */
   htmlFor?: any,
   
   /** Base CSS class to be applied to the element. No class is applied by default. */
   baseClass?: string,

   /** Set to `true` to add red asterisk for required fields. */
   asterisk?: boolean,

   /** Name of the HTML element to be rendered. Default is `div`. */
   tag?: string
   
}

export class Label extends Cx.Widget<LabelProps> {}
