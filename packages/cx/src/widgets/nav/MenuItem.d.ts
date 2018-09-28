import * as Cx from '../../core';
import {KeyboardShortcut} from "../../ui/keyboardShortcuts";

export interface MenuItemProps extends Cx.HtmlElementProps {
   
   /** Base CSS class to be applied to the element. Defaults to 'menuitem'. */
   baseClass?: string,
   hoverFocusTimeout?: number,
   clickToOpen?: boolean,
   hoverToOpen?: boolean,
   horizontal?: boolean,
   arrow?: Cx.BooleanProp,
   dropdownOptions?: Cx.Config | null,
   showCursor?: boolean,
   pad?: boolean,
   placement?: string | null,
   autoClose?: boolean,
   icons?: boolean,
   keyboardShortcut?: KeyboardShortcut
}

export class MenuItem extends Cx.Widget<MenuItemProps> {}
