import { Widget } from "../../ui/Widget";
import { VDOM } from "../../ui/VDOM";
import { tooltipMouseMove, tooltipMouseLeave } from "./tooltip-ops";
import { closest, isObject } from "../../util";

export class FlyweightTooltipTracker extends Widget {
   initInstance(context, instance) {
      let handler = (e) => this.handleMouseMove(e, instance);
      document.addEventListener("mousemove", handler);
      instance.subscribeOnDestroy(() => {
         document.removeEventListener("mousemove", handler);
      });
   }

   render(context, instance, key) {
      return null;
   }

   handleMouseMove(e, instance) {
      if (!this.onGetTooltip) return;
      if (instance.lastTarget != e.target) {
         instance.lastTarget = e.target;
         let tooltip = null;
         instance.parentEl = closest(e.target, (element) => {
            tooltip = instance.invoke("onGetTooltip", element, instance);
            if (tooltip) return true;
         });
         instance.tooltip = tooltip;
      }
      if (!instance.parentEl) tooltipMouseMove(e, instance, null);
      else
         tooltipMouseMove(e, instance, instance.tooltip, {
            target: instance.parentEl,
         });
   }
}
