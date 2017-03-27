import {Widget} from '../../ui/Widget';
import {PureContainer} from '../../ui/PureContainer';

export class ValidationGroup extends PureContainer {

   declareData() {
      return super.declareData(...arguments, {
         errors: undefined,
         valid: undefined,
         invalid: undefined,
         disabled: undefined,
         enabled: undefined
      })
   }

   explore(context, instance) {

      let parentDisabled = context.parentDisabled;

      if (typeof instance.data.enabled != 'undefined')
         instance.data.disabled = !instance.data.enabled;

      context.parentDisabled = parentDisabled || instance.data.disabled;

      if (!context.validation)
         context.validation = {
            errors: []
         };

      let validationErrors = context.validation.errors.length;
      super.explore(context, instance);
      instance.valid = context.validation.errors.length == validationErrors;
      instance.set('valid', instance.valid);
      instance.set('invalid', !instance.valid);
      instance.set('errors', context.validation.errors);

      context.parentDisabled = parentDisabled;
   }
}

//ValidationGroup.prototype.pure = false; //recheck

Widget.alias('validation-group', ValidationGroup);