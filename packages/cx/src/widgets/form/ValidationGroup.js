import { Widget } from "../../ui/Widget";
import { PureContainer } from "../../ui/PureContainer";
import { isDefined } from "../../util/isDefined";
import { shallowEquals } from "../../util/shallowEquals";
import { coalesce } from "../../util/coalesce";

export class ValidationGroup extends PureContainer {
   declareData() {
      return super.declareData(...arguments, {
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
      });
   }

   explore(context, instance) {
      if (isDefined(instance.data.enabled)) instance.data.disabled = !instance.data.enabled;

      instance.validation = {
         errors: [],
      };

      context.push("parentDisabled", coalesce(instance.data.disabled, context.parentDisabled));
      context.push("parentReadOnly", coalesce(instance.data.readOnly, context.parentReadOnly));
      context.push("parentViewMode", coalesce(instance.data.viewMode, context.parentViewMode));
      context.push("parentTabOnEnterKey", coalesce(instance.data.tabOnEnterKey, context.parentTabOnEnterKey));
      context.push("parentVisited", coalesce(instance.data.visited, context.parentVisited));
      context.push("validation", instance.validation);

      super.explore(context, instance);
   }

   exploreCleanup(context, instance) {
      context.pop("validation");
      context.pop("parentVisited");
      context.pop("parentDisabled");
      context.pop("parentReadOnly");
      context.pop("parentViewMode");
      context.pop("parentTabOnEnterKey");

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
