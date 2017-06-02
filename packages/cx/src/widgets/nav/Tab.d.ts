import * as Cx from '../../core';

interface TabProps extends Cx.HtmlElementProps {

   /** A value to be written to the `value` property if the tab is clicked. */
   tab?: Cx.Prop<string | number>,

   /** 
    * Value of the currently selected tab. 
    * If `value` is equal to `tab`, the tab appears active. 
    */
   value?: Cx.StringProp,

   /** Set to `true` to disable selection. */
   disabled?: Cx.BooleanProp,
 
   /** Base CSS class to be applied to the element. No class is applied by default. */
   baseClass?: string,

   /** Name of the HTML element to be rendered. Default is `div`. */
   tag?: string,
   
   /** Determines if tab should receive focus on `mousedown` event. 
    *  Default is `false`, which means that focus can be set only using the keyboard `Tab` key.
    */
   focusOnMouseDown?: boolean,

   /** Set to true to set the default tab. */
   default?: boolean
   
}

export class Tab extends Cx.Widget<TabProps> {}
