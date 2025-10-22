import type { RenderingContext } from "../../ui/RenderingContext";
import type { Instance } from "../../ui/Instance";
import { Widget } from "../../ui/Widget";
import { PureContainer } from "../../ui/PureContainer";
import { isDefined } from "../../util/isDefined";
import { shallowEquals } from "../../util/shallowEquals";
import { coalesce } from "../../util/coalesce";

interface ValidationGroupInstance extends Instance {
   validation: {
      errors: Array<{
         fieldId: string;
         message: string;
         visited: boolean;
         type: string;
      }>;
   };
   valid?: boolean;
}

export class ValidationGroup extends PureContainer {
   public errors?: unknown;
   public isolated?: boolean;

   declareData(...args: Record<string, unknown>[]): Record<string, unknown> {
      return super.declareData(...args, {
         errors: undefined,
         valid: undefined,
         invalid: undefined,
         disabled: undefined,
         enabled: undefined,
         readOnly: undefined,
         viewMode: undefined,
         tabOnEnterKey: undefined,
         isolated: undefined,
         visited: undefined,
         strict: undefined,
         asterisk: undefined,
      });
   }

   explore(context: RenderingContext, instance: ValidationGroupInstance): void {
      if (isDefined(instance.data.enabled)) instance.data.disabled = !instance.data.enabled;

      instance.validation = {
         errors: [],
      };

      context.push("parentStrict", coalesce(instance.data.strict, context.parentStrict));
      context.push("parentDisabled", coalesce(instance.data.disabled, context.parentDisabled));
      context.push("parentReadOnly", coalesce(instance.data.readOnly, context.parentReadOnly));
      context.push("parentViewMode", coalesce(instance.data.viewMode, context.parentViewMode));
      context.push("parentTabOnEnterKey", coalesce(instance.data.tabOnEnterKey, context.parentTabOnEnterKey));
      context.push("parentVisited", coalesce(instance.data.visited, context.parentVisited));
      context.push("parentAsterisk", coalesce(instance.data.asterisk, context.parentAsterisk));
      context.push("validation", instance.validation);

      super.explore(context, instance);
   }

   exploreCleanup(context: RenderingContext, instance: ValidationGroupInstance): void {
      context.pop("validation");
      context.pop("parentVisited");
      context.pop("parentDisabled");
      context.pop("parentReadOnly");
      context.pop("parentViewMode");
      context.pop("parentTabOnEnterKey");
      context.pop("parentStrict");
      context.pop("parentAsterisk");

      instance.valid = instance.validation.errors.length == 0;
      if (!instance.valid && !this.isolated && context.validation)
         context.validation.errors.push(...instance.validation.errors);

      instance.set("valid", instance.valid);
      instance.set("invalid", !instance.valid);

      if (this.errors && !shallowEquals(instance.data.errors, instance.validation.errors))
         instance.set("errors", instance.validation.errors);
   }
}

ValidationGroup.prototype.isolated = false;

Widget.alias("validation-group", ValidationGroup);
