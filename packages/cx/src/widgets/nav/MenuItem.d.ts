import * as Cx from "../../core";
import { Instance } from "../../ui";
import { KeyboardShortcut } from "../../ui/keyboardShortcuts";

export interface MenuItemProps extends Cx.HtmlElementProps {
   /** Base CSS class to be applied to the element. Defaults to 'menuitem'. */
   baseClass?: string;
   hoverFocusTimeout?: number;
   clickToOpen?: boolean;
   hoverToOpen?: boolean;
   horizontal?: boolean;
   arrow?: Cx.BooleanProp;
   dropdownOptions?: Cx.Config;
   showCursor?: boolean;
   pad?: boolean;
   placement?: string;
   placementOrder?: string;
   autoClose?: boolean;
   icons?: boolean;
   icon: Cx.StringProp;
   keyboardShortcut?: KeyboardShortcut;
   tooltip?: string | Cx.Config;
   openOnFocus?: boolean;
   disabled?: Cx.BooleanProp;

   /**
    * Click handler.
    *
    * @param e - Event.
    * @param instance - Cx widget instance that fired the event.
    */
   onClick?: string | ((e: React.SyntheticEvent<any>, instance: Instance) => void);
}

export class MenuItem extends Cx.Widget<MenuItemProps> {}
