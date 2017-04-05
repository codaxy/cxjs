import * as Cx from '../../core';

export interface MenuItemProps extends Cx.HtmlElementProps {
   
   baseClass?: string,
   hoverFocusTimeout?: number,
   clickToOpen?: boolean,
   horizontal?: boolean,
   arrow?: boolean,
   dropdownOptions?: Cx.Config | null,
   showCursor?: boolean,
   pad?: boolean,
   placement?: string | null
   
}

export class MenuItem extends Cx.Widget<MenuItemProps> {}
