import {Widget} from '../Widget';
import {PureContainer} from '../PureContainer';

export class ValidationGroup extends PureContainer {

   declareData() {
      return super.declareData(...arguments, {
         errors: undefined,
         valid: undefined,
         invalid: undefined
      })
   }

   explore(context, instance) {

      if (!context.validation)
         context.validation = {
            errors: []
         };

      var validationErrors = context.validation.errors.length;
      super.explore(context, instance);
      instance.valid = context.validation.errors.length == validationErrors;
   }

   prepare(context, instance) {

      var validationErrors = context.validation.errors.length;

      super.prepare(context, instance);

      instance.valid = instance.valid && context.validation.errors.length == validationErrors;

      instance.set('valid', instance.valid);
      instance.set('invalid', !instance.valid);
   }
}

ValidationGroup.prototype.pure = false;

Widget.alias('validation-group', ValidationGroup);