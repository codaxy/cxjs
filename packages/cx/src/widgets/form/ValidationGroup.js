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

      if (isDefined(instance.data.enabled))
         instance.data.disabled = !instance.data.enabled;

      context.push('parentDisabled', context.parentDisabled || instance.data.disabled);
      context.push('parentReadOnly', context.parentReadOnly || instance.data.readOnly);
      context.push('parentViewMode', context.parentViewMode || instance.data.viewMode);
      context.push('parentTabOnEnterKey', context.parentTabOnEnterKey || instance.data.tabOnEnterKey);

      instance.validation = {
         errors: []
      };

      context.push('validation', instance.validation);
      super.explore(context, instance);
   }

   exploreCleanup(context, instance) {
      context.pop('validation');
      instance.valid = instance.validation.errors.length == 0;
      if (!instance.valid && !this.isolated && context.validation)
         context.validation.errors.push(...instance.validation.errors);
      instance.set('valid', instance.valid);
      instance.set('invalid', !instance.valid);

      if (this.errors && JSON.stringify(instance.data.errors) != JSON.stringify(context.validation.errors))
         instance.set('errors', context.validation.errors);

      context.pop('parentDisabled');
      context.pop('parentReadOnly');
      context.pop('parentViewMode');
      context.pop('parentTabOnEnterKey');
   }
}

ValidationGroup.prototype.isolated = false;

Widget.alias('validation-group', ValidationGroup);