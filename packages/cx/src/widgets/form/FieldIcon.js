import { Widget } from "../../ui/Widget";
import { Icon } from "../Icon";
import { tooltipMouseLeave, tooltipMouseMove } from "../overlay/tooltip-ops";

export class FieldIcon extends Widget {
   declareData(...args) {
      super.declareData(...args, {
         name: undefined,
      });
   }

   render(context, instance, key) {
      let { data } = instance;
      if (!data.name) return null;

      let onClick, onMouseMove, onMouseLeave;

      if (this.onClick)
         onClick = (e) => {
            instance.invoke("onClick", e, instance);
         };

      if (this.tooltip) {
         onMouseLeave = (e) => {
            tooltipMouseLeave(e, instance, this.tooltip);
         };
         onMouseMove = (e) => {
            tooltipMouseMove(e, instance, this.tooltip);
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
