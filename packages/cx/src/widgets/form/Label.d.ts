import * as Cx from '../../core';

interface LabelProps extends Cx.HtmlElementProps {
   
   /** Used in combination with `asterisk` to indicate required fields. */
   required?: Cx.BooleanProp,

   /** Set to true to disable the label. */
   disabled?: Cx.BooleanProp,

   /** Id of the field. */
   htmlFor?: Cx.StringProp,
   
   /** Base CSS class to be applied to the element. No class is applied by default. */
   baseClass?: string,

   /** Set to `true` to add red asterisk for required fields. */
   asterisk?: boolean,

   /** Name of the HTML element to be rendered. Default is `div`. */
   tag?: string
   
}

export class Label extends Cx.Widget<LabelProps> {}
