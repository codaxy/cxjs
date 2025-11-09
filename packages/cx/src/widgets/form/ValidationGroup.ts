import type { RenderingContext } from "../../ui/RenderingContext";
import type { Instance } from "../../ui/Instance";
import { Widget } from "../../ui/Widget";
import { PureContainer, PureContainerConfig } from "../../ui/PureContainer";
import { isDefined } from "../../util/isDefined";
import { shallowEquals } from "../../util/shallowEquals";
import { coalesce } from "../../util/coalesce";
import { BooleanProp, Prop } from "../../ui/Prop";

export interface ValidationError {
   fieldId: string;
   message: string;
   visited: boolean;
   type: string;
}

interface ValidationGroupInstance extends Instance {
   validation: {
      errors: ValidationError[];
   };
   valid?: boolean;
}

export interface ValidationGroupConfig extends PureContainerConfig {
   /** Binding used to store validation errors in the store. */
   errors?: Prop<ValidationError[]>;

   /** Binding which will be set to true if all child form field are valid. */
   valid?: BooleanProp;

   /** Binding which will be set to true if any of child form field reports validation error. */
   invalid?: BooleanProp;

   /** Set to `false` to disable all inner elements that support `disabled` property. */
   enabled?: BooleanProp;

   /** Set to `true` to disable all inner elements that support `disabled` property. */
   disabled?: BooleanProp;

   /** Set to `true` to make read-only all inner elements that support `readOnly` property. */
   readOnly?: BooleanProp;

   /** Set to `true` to isolate children from participating in outer validation scopes. */
   isolated?: BooleanProp;

   /** Set to `true` to notify all children to report errors. */
   visited?: BooleanProp;

   /** Set to `true` to tab on Enter key for all children. */
   tabOnEnterKey?: BooleanProp;

   /** Set to `true` to set all child fields to view mode. */
   viewMode?: BooleanProp;

   /** Set to `true` to force children to respect disabled, readOnly, viewMode and visited flags set on the group level. */
   strict?: BooleanProp;

   /** Set to `true` to add red asterisk for all required fields inside the group. */
   asterisk?: BooleanProp;
}

export class ValidationGroup extends PureContainer<ValidationGroupConfig, ValidationGroupInstance> {
   declare errors?: Prop<ValidationError[]>;
   declare isolated?: boolean;

   declareData(...args: Record<string, unknown>[]): void {
      super.declareData(...args, {
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
