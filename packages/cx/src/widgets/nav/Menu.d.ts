import * as Cx from '../../core';

interface MenuProps extends Cx.HtmlElementProps{

   /** Set to `true` for horizontal menus. */
   horizontal?: boolean,
   
   defaultVerticalItemPadding?: string,
   defaultHorizontalItemPadding?: string,
   baseClass?: string

}

export class Menu extends Cx.Widget<MenuProps> {}
