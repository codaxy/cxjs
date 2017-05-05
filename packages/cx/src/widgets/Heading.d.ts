import * as Cx from '../core';

interface HeadingProps extends Cx.HtmlElementProps {
   
   /** Name of the HTML element to be rendered. Default is `div`. */
   tag?: string,

   /** Heading level. Allowed values go from 1 to 6. Default is 3. */
   level?: number | string,

    /** Base CSS class. Default is `heading`. */
    baseClass?: string

}

export class Heading extends Cx.Widget<HeadingProps> {}
