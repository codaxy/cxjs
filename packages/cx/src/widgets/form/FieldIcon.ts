import { Widget } from "../../ui/Widget";
import { Icon } from "../Icon";
import { tooltipMouseLeave, tooltipMouseMove, TooltipConfig } from "../overlay/tooltip-ops";
import type { RenderingContext } from "../../ui/RenderingContext";
import type { Instance } from "../../ui/Instance";

export class FieldIcon extends Widget {
   onClick?: (e: MouseEvent, instance: Instance) => void;
   tooltip?: TooltipConfig;

   declareData(...args: Record<string, unknown>[]): void {
      super.declareData(...args, {
         name: undefined,
      });
   }

   render(context: RenderingContext, instance: Instance, key: string): React.ReactNode {
      let { data } = instance;
      if (!data.name) return null;

      let onClick: ((e: React.MouseEvent) => void) | undefined;
      let onMouseMove: ((e: React.MouseEvent) => void) | undefined;
      let onMouseLeave: ((e: React.MouseEvent) => void) | undefined;

      if (this.onClick)
         onClick = (e: React.MouseEvent) => {
            instance.invoke("onClick", e, instance);
         };

      if (this.tooltip) {
         onMouseLeave = (e: React.MouseEvent) => {
            tooltipMouseLeave(e, instance, this.tooltip!);
         };
         onMouseMove = (e: React.MouseEvent) => {
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
