import { openContextMenu, Menu, Dropdown, Button } from "cx/widgets";
import { Controller, enableCultureSensitiveFormatting } from "cx/ui";

enableCultureSensitiveFormatting();

class ParentController extends Controller {
   action() {
      alert("Action");
   }

   onInit() {
      this.timer = setInterval(() => {
         this.store.set("time", Date.now());
      }, 1000);
   }

   onDestroy() {
      clearInterval(this.timer);
   }
}

export default (
   <cx>
      <div>
         <Button
            onClick={(e, { store }) => {
               store.toggle("dropdown");
            }}
         >
            Toggle Dropdown
         </Button>
         <Dropdown style="padding: 10px;" visible-bind="dropdown" autoFocus dismissOnFocusOut>
            <div text-tpl="{time:time;HHmmssN}" />
            <div
               controller={ParentController}
               onContextMenu={(e, instance) =>
                  openContextMenu(
                     e,
                     <cx>
                        <Menu>
                           <a href="#" onClick="action">
                              Action
                           </a>
                           <a href="#">Item 2</a>
                           <a href="#">Item 3</a>
                           <a href="#">Item 4</a>
                           <a href="#">Item 5</a>
                           <a href="#">Item 6</a>
                        </Menu>
                     </cx>,
                     instance
                  )
               }
               style="padding: 5px; border: 1px solid lightgray"
            >
               Right Click Here
            </div>

            <div
               onContextMenu={(e, { store }) =>
                  openContextMenu(
                     e,
                     <cx>
                        <div>This menu doesn't contain any focusable content.</div>
                     </cx>,
                     store
                  )
               }
               style="padding: 5px; border: 1px solid lightgray"
            >
               Non-Focusable
            </div>
         </Dropdown>
      </div>
   </cx>
);
