import * as Cx from '../core';

interface HeadingProps extends Cx.HtmlElementProps{
    /** Heading level.
     * Allowed values go from 1 to 6. Default is 2. */
    level?: number,
    /** Base CSS class. Default is `heading`. */
    baseClass?: string
}

export class Heading extends Cx.Widget<HeadingProps> {}
