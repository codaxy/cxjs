import { registerKeyboardShortcut } from "cx/ui";
import { KeyCode } from "cx/util";

export default {
   onInit() {
      this.unregister = registerKeyboardShortcut(KeyCode.esc, (e) => {
         e.stopPropagation();
         //this.store.set("search.visible", true);
         document.getElementById("docsearch").focus();
      });
   },

   onDestroy() {
      this.unregister();
   },
};
