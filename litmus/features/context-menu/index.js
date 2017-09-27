import {FlexCol, FlexRow, HtmlElement, Menu, Submenu, Dropdown} from "cx/widgets";

class ContextMenu extends Dropdown {}
ContextMenu.prototype.trackMouse = true;
ContextMenu.prototype.dismissOnFocusOut = true;
ContextMenu.prototype.firstChildDefinesWidth = true;
ContextMenu.prototype.matchWidth = false;
ContextMenu.prototype.placementOrder = 'down-right right up-right down-left left up-left';
ContextMenu.prototype.offset = 0;
ContextMenu.prototype.autoFocus = true;

export const openContextMenu = (e, content, store, options) => {
   e.preventDefault();
   e.stopPropagation();
   let menu = ContextMenu.create({
      relatedElement: e.currentTarget,
      mousePosition: {
         x: e.clientX,
         y: e.clientY
      },
      items: content
   });
   menu.open(store, options);
};

export default (
   <cx>
      <div
         onContextMenu={(e, {store}) => openContextMenu(e, (
            <cx>
               <Menu>
                  <a href="#">Item 1</a>
                  <a href="#">Item 2</a>
                  <a href="#">Item 3</a>
                  <a href="#">Item 4</a>
                  <a href="#">Item 5</a>
                  <a href="#">Item 6</a>
               </Menu>
            </cx>
         ), store)}
         style="padding: 5px; border: 1px solid lightgray"
      >
         Right Click Here
      </div>
   </cx>
);
