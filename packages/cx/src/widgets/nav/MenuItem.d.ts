import * as Cx from '../../core';

export interface MenuItemProps extends Cx.HtmlElementProps {
   
   /** Base CSS class to be applied to the element. Defaults to 'menuitem'. */
   baseClass?: string,
   hoverFocusTimeout?: number,
   clickToOpen?: boolean,
   hoverToOpen?: boolean,
   horizontal?: boolean,
   arrow?: boolean,
   dropdownOptions?: Cx.Config | null,
   showCursor?: boolean,
   pad?: boolean,
   placement?: string | null,
   autoClose?: boolean
   
}

export class MenuItem extends Cx.Widget<MenuItemProps> {}
