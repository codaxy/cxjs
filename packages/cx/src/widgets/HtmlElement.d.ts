import * as Cx from "../core";

interface HtmlElementProps extends Cx.HtmlElementProps {
   /** HTML to be injected into the element. */
   innerHtml?: Cx.StringProp;

   attrs?: Cx.StructuredProp;
   data?: Cx.StructuredProp;

   /** Name of the HTML element to be rendered. Default is `div`. */
   tag?: string;

   /** HTML to be injected into the element. */
   html?: Cx.StringProp;

   styled?: boolean;

   //** Set to true to automatically focus the element when mounted. */
   autoFocus?: Cx.BooleanProp;

   /** Allow any prop if HtmlElement is used directly.
    * e.g. `<HtmlElement tag="form" onSubmit="submit" />`*/
   [key: string]: any;

   /** Callback function called when the element is mounted in the DOM. Provides reference to the element and the component instance. */
   onRef?: string | ((element: any, instance: Instance) => void);
}

export class HtmlElement extends Cx.Widget<HtmlElementProps> {}
