import { Widget } from "../../ui/Widget";
import { Icon } from "../Icon";
import { tooltipMouseLeave, tooltipMouseMove } from "../overlay/tooltip-ops";
import type { RenderingContext } from "../../ui/RenderingContext";
import type { WidgetInstance } from "../../types/instance";
import type { TooltipConfig } from "../../types/tooltip";

export class FieldIcon extends Widget {
   onClick?: (e: MouseEvent, instance: WidgetInstance) => void;
   tooltip?: TooltipConfig;

   declareData(...args: Record<string, unknown>[]): void {
      super.declareData(...args, {
         name: undefined,
      });
   }

   render(context: RenderingContext, instance: WidgetInstance, key: string | number): React.ReactNode {
      let { data } = instance;
      if (!data.name) return null;

      let onClick: ((e: MouseEvent) => void) | undefined;
      let onMouseMove: ((e: MouseEvent) => void) | undefined;
      let onMouseLeave: ((e: MouseEvent) => void) | undefined;

      if (this.onClick)
         onClick = (e: MouseEvent) => {
            instance.invoke("onClick", e, instance);
         };

      if (this.tooltip) {
         onMouseLeave = (e: MouseEvent) => {
            tooltipMouseLeave(e, instance, this.tooltip!);
         };
         onMouseMove = (e: MouseEvent) => {
            tooltipMouseMove(e, instance, this.tooltip!);
         };
      }

      return Icon.render(data.name, {
         className: data.classNames,
         style: data.style,
         onClick,
         onMouseMove,
         onMouseLeave,
      });
   }
}

FieldIcon.prototype.styled = true;
