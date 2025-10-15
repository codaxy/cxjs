import { Field } from "./Field";
import type { RenderingContext } from "../../ui/RenderingContext";
import type { WidgetInstance } from "../../types/instance";

export class Validator extends Field {
   declareData(...args: Record<string, unknown>[]): Record<string, unknown> {
      return super.declareData(...args, {
         value: {
            structured: true,
         },
         disabled: undefined,
      });
   }

   isEmpty(data: Record<string, unknown>): boolean {
      return false;
   }

   render(context: RenderingContext, instance: WidgetInstance, key: string | number): React.ReactNode {
      if (!instance.state?.visited || !instance.data.error) return null;
      return this.renderChildren(context, instance, key);
   }
}
