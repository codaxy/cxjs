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
      let parentEl, tooltip;
      if (instance.lastTarget == e.target) return;

      instance.lastTarget = e.target;
      parentEl = closest(e.target, (element) => {
         tooltip = instance.invoke("onGetTooltip", element, instance);
         if (tooltip) return true;
      });

      if (!parentEl) tooltipMouseLeave(e, instance, instance.tooltip, { target: instance.parentEl });
      else {
         instance.tooltip = tooltip;
         instance.parentEl = parentEl;
         tooltipMouseMove(e, instance, instance.tooltip, {
            target: parentEl,
         });
      }
   }
}
