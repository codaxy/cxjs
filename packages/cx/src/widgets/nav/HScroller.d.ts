import * as Cx from '../../core';

interface HScrollerProps extends Cx.StyledContainerProps {

   /** Base CSS class. Default is `hscroller`. */
   baseClass?: string,
}

export class HScroller extends Cx.Widget<HScrollerProps> {}
