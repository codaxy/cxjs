import { Instance } from "../../ui/Instance";
import { RenderingContext } from "../../ui/RenderingContext";
import { Widget } from "../../ui/Widget";
import { closest } from "../../util";
import type { TooltipInstance } from "./Tooltip";
import {
   tooltipMouseLeave,
   tooltipMouseMove,
   TooltipParentInstance,
   TooltipProp,
} from "./tooltip-ops";

export interface FlyweightTooltipTrackerConfig {
   onGetTooltip?: (element: Element, instance: Instance) => TooltipProp;
}

export class FlyweightTooltipTrackerInstance
   extends Instance<FlyweightTooltipTracker>
   implements TooltipParentInstance
{
   declare lastTarget?: EventTarget | null;
   declare tooltip?: TooltipProp;
   declare parentEl?: Element;
   declare tooltips: { [key: string]: TooltipInstance };
}

export class FlyweightTooltipTracker extends Widget {
   declare onGetTooltip?: (
      element: Element,
      instance: Instance,
   ) => TooltipProp | undefined;

   initInstance(
      context: RenderingContext,
      instance: FlyweightTooltipTrackerInstance,
   ): void {
      let handler = (e: MouseEvent) => this.handleMouseMove(e, instance);
      if (typeof document !== "undefined") {
         document.addEventListener("mousemove", handler);
         instance.subscribeOnDestroy(() => {
            document.removeEventListener("mousemove", handler);
         });
      }
   }

   render(
      context: RenderingContext,
      instance: FlyweightTooltipTrackerInstance,
      key: string,
   ): any {
      return null;
   }

   handleMouseMove(
      e: MouseEvent,
      instance: FlyweightTooltipTrackerInstance,
   ): void {
      if (!this.onGetTooltip) return;
      let parentEl: Element | null, tooltip: TooltipProp | undefined;
      if (instance.lastTarget == e.target) return;

      instance.lastTarget = e.target;
      parentEl = closest(e.target as Element, (element: Element) => {
         tooltip = instance.invoke("onGetTooltip", element, instance);
         return !!tooltip;
      });

      if (!parentEl)
         tooltipMouseLeave(e, instance, instance.tooltip!, {
            target: instance.parentEl,
         });
      else {
         instance.tooltip = tooltip;
         instance.parentEl = parentEl;
         tooltipMouseMove(e, instance, instance.tooltip!, {
            target: parentEl,
         });
      }
   }
}
