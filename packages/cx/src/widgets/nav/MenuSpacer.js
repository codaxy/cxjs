import {Widget} from "../../ui/Widget";

export class MenuSpacer extends Widget {
   render(context, instance, key) {
      return {
         key: true,
         atomic: true,
         spacer: true
      };
   }
}

MenuSpacer.prototype.isMenuSpacer = true;