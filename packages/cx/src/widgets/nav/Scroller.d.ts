import * as Cx from '../../core';

interface ScrollerProps extends Cx.StyledContainerProps {

   /** Base CSS class. Default is `hscroller`. */
   baseClass?: string,

   horizontal?: boolean,

   vertical?: boolean
}

export class Scroller extends Cx.Widget<ScrollerProps> {}
export class HScroller extends Cx.Widget<ScrollerProps> {}
export class VScroller extends Cx.Widget<ScrollerProps> {}
