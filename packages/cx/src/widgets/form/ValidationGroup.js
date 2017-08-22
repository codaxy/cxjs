import {Widget} from '../../ui/Widget';
import {PureContainer} from '../../ui/PureContainer';
import {isDefined} from '../../util/isDefined';

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
         isolated: undefined
      })
   }

   explore(context, instance) {

      let parentDisabled = context.parentDisabled,
         parentReadOnly = context.parentReadOnly,
         parentViewMode = context.parentViewMode,
         parentTabOnEnterKey = context.tabOnEnterKey;

      if (isDefined(instance.data.enabled))
         instance.data.disabled = !instance.data.enabled;

      context.parentDisabled = parentDisabled || instance.data.disabled;
      context.parentReadOnly = parentReadOnly || instance.data.readOnly;
      context.parentViewMode = parentViewMode || instance.data.viewMode;
      context.parentTabOnEnterKey = parentTabOnEnterKey || instance.data.tabOnEnterKey;

      let validation = context.validation;

      if (!context.validation || instance.data.isolated)
         context.validation = {
            errors: []
         };

      let validationErrors = context.validation.errors.length;
      super.explore(context, instance);
      instance.valid = context.validation.errors.length == validationErrors;
      instance.set('valid', instance.valid);
      instance.set('invalid', !instance.valid);

      if (this.errors && JSON.stringify(instance.data.errors) != JSON.stringify(context.validation.errors))
         instance.set('errors', context.validation.errors);

      context.parentDisabled = parentDisabled;
      context.parentReadOnly = parentReadOnly;
      context.parentViewMode = parentViewMode;
      context.parentTabOnEnterKey = parentTabOnEnterKey;

      context.validation = validation;
   }
}

ValidationGroup.prototype.isolated = false;

//ValidationGroup.prototype.pure = false; //recheck

Widget.alias('validation-group', ValidationGroup);