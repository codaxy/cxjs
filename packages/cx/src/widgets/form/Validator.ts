import { Field, FieldConfig } from "./Field";
import type { RenderingContext } from "../../ui/RenderingContext";
import type { Instance } from "../../ui/Instance";

export interface ValidatorConfig extends FieldConfig {
   /** Custom validation function. */
   onValidate?: string | ((value: unknown, instance: Instance, validationParams: Record<string, unknown>) => unknown);
}

export class Validator extends Field<ValidatorConfig> {
   constructor(config?: ValidatorConfig) {
      super(config);
   }
   declareData(...args: Record<string, unknown>[]): void {
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

   render(context: RenderingContext, instance: Instance, key: string): any {
      if (!instance.state?.visited || !instance.data.error) return null;
      return this.renderChildren(context, instance, key);
   }
}
