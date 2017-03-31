import * as Cx from '../../core';

interface LabelProps extends Cx.HtmlElementProps{
   
   /** Base CSS class to be applied to the element. No class is applied by default. */
   baseClass?: string,

   /** Set to `true` to add red asterisk for required fields. */
   asterisk?: boolean
}

export class Label extends Cx.Widget<LabelProps> {}
