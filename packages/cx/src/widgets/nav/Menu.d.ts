import * as Cx from '../../core';

interface MenuProps extends Cx.HtmlElementProps {

   /** Set to `true` for horizontal menus. */
   horizontal?: boolean,
   
   /** 
    * Controls size of menu items. Supported values are `xsmall`, `small`, `medium`, `large` or `xlarge`. 
    * For horizontal menus default size is `small` and for vertical it's `medium`. 
    */
   itemPadding?: string,

   defaultVerticalItemPadding?: string,
   defaultHorizontalItemPadding?: string,

   /** Set to true to put overflow items into a submenu on the right. */
   overflow?: boolean,

   /** Icon to be used for the overflow menu. */
   overflowIcon?: boolean,

   /** Base CSS class to be applied to the element. No class is applied by default. */
   baseClass?: string
}

export class Menu extends Cx.Widget<MenuProps> {}
