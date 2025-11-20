import { Widget, WidgetConfig } from "../../ui/Widget";
import { Icon } from "../Icon";
import { tooltipMouseLeave, tooltipMouseMove, TooltipConfig, TooltipParentInstance } from "../overlay/tooltip-ops";
import type { RenderingContext } from "../../ui/RenderingContext";
import { Instance } from "../../ui/Instance";
import type { TooltipInstance } from "../overlay/Tooltip";
import { StringProp } from "../../ui/Prop";

export interface FieldIconConfig extends WidgetConfig {
   onClick?: (e: MouseEvent, instance: FieldIconInstance) => void;
   tooltip?: TooltipConfig;
   name: StringProp;
}

export class FieldIconInstance extends Instance<FieldIcon> implements TooltipParentInstance {
   tooltips: { [key: string]: TooltipInstance };
}

export class FieldIcon extends Widget {
   declare onClick?: (e: MouseEvent, instance: FieldIconInstance) => void;
   declare tooltip?: TooltipConfig;

   declareData(...args: Record<string, unknown>[]): void {
      super.declareData(...args, {
         name: undefined,
      });
   }

   render(context: RenderingContext, instance: FieldIconInstance, key: string): React.ReactNode {
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
            tooltipMouseLeave(e, instance, this.tooltip!, {});
         };
         onMouseMove = (e: React.MouseEvent) => {
            tooltipMouseMove(e, instance, this.tooltip!, {});
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
