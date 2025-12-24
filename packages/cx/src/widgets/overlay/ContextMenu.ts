import { Store } from "../../data/Store";
import { Instance } from "../../ui/Instance";
import { Dropdown, DropdownConfig } from "./Dropdown";
import { getCursorPos } from "./captureMouse";

export interface ContextMenuConfig extends DropdownConfig {}

export class ContextMenu extends Dropdown {
   constructor(config?: ContextMenuConfig) {
      super(config);
   }
}
ContextMenu.prototype.trackMouse = true;
ContextMenu.prototype.dismissOnFocusOut = true;
ContextMenu.prototype.firstChildDefinesWidth = true;
ContextMenu.prototype.matchWidth = false;
ContextMenu.prototype.placementOrder = "down-right right up-right down-left left up-left";
ContextMenu.prototype.offset = 0;
ContextMenu.prototype.autoFocus = true;
ContextMenu.prototype.autoFocusFirstChild = false;
ContextMenu.prototype.focusable = true;

export const openContextMenu = (
   e: React.MouseEvent,
   content: any,
   storeOrInstance?: Store | Instance,
   options?: any,
) => {
   e.preventDefault();
   e.stopPropagation();
   let position = getCursorPos(e);
   let menu = ContextMenu.create({
      relatedElement: e.currentTarget,
      mousePosition: {
         x: position.clientX,
         y: position.clientY,
      },
      trackMouse: true,
      items: content,
   });
   return menu.open(storeOrInstance, options);
};
