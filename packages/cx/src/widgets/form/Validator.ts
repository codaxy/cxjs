import { Field, FieldConfig } from "./Field";
import type { RenderingContext } from "../../ui/RenderingContext";
import type { Instance } from "../../ui/Instance";
import type { StructuredProp, ResolvePropType } from "../../ui/Prop";

/**
 * Configuration for Validator widget.
 *
 * The value type parameter enables type inference for the onValidate callback:
 * - Literal values preserve their types
 * - AccessorChain<T> resolves to T
 * - Bind/Tpl/Expr resolve to any
 * - Structured props (objects) have each property resolved individually
 *
 * @example
 * ```typescript
 * <Validator
 *    value={{
 *       password: model.user.password,
 *       confirmPassword: model.user.confirmPassword
 *    }}
 *    onValidate={(value) => {
 *       if (value.password !== value.confirmPassword)
 *          return "Passwords do not match";
 *    }}
 * />
 * ```
 */
export interface ValidatorConfig<V = StructuredProp> extends FieldConfig {
   /** The value to be validated. Can be a structured object with multiple fields. */
   value?: V;

   /** Custom validation function. */
   onValidate?:
      | string
      | ((value: ResolvePropType<V>, instance: Instance, validationParams: Record<string, unknown>) => unknown);
}

export class Validator<V = StructuredProp> extends Field<ValidatorConfig<V>> {
   constructor(config?: ValidatorConfig<V>) {
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
