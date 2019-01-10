import {Dropdown} from './Dropdown';
import {getCursorPos} from "./captureMouse";

export class ContextMenu extends Dropdown {}
ContextMenu.prototype.trackMouse = true;
ContextMenu.prototype.dismissOnFocusOut = true;
ContextMenu.prototype.firstChildDefinesWidth = true;
ContextMenu.prototype.matchWidth = false;
ContextMenu.prototype.placementOrder = 'down-right right up-right down-left left up-left';
ContextMenu.prototype.offset = 0;
ContextMenu.prototype.autoFocus = true;
ContextMenu.prototype.autoFocusFirstChild = true;
ContextMenu.prototype.focusable = true;

export const openContextMenu = (e, content, store, options) => {
   e.preventDefault();
   e.stopPropagation();
   let position = getCursorPos(e);
   let menu = ContextMenu.create({
      relatedElement: e.currentTarget,
      mousePosition: {
         x: position.clientX,
         y: position.clientY
      },
      trackMouse: true,
      items: content
   });
   menu.open(store, options);
};