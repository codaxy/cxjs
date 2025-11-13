import { Widget, WidgetConfig } from "../../ui/Widget";
import { Instance } from "../../ui/Instance";
import { RenderingContext } from "../../ui/RenderingContext";

export interface MenuSpacerConfig extends WidgetConfig {}

export class MenuSpacer extends Widget<MenuSpacerConfig> {
   declare public isMenuSpacer: boolean;

   render(context: RenderingContext, instance: Instance, key: string) {
      return {
         key: true,
         atomic: true,
         spacer: true
      };
   }
}

MenuSpacer.prototype.isMenuSpacer = true;