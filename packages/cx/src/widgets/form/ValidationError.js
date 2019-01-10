import {Widget, VDOM} from '../../ui/Widget';
import {Field} from './Field';

export class ValidationError extends Widget {

   checkVisible(context, instance, data) {
      if (data.visible && context.lastFieldId && context.validation && context.validation.errors && context.validation.errors.length > 0) {
         var lastError = instance.lastError = context.validation.errors[context.validation.errors.length - 1];
         return lastError.fieldId == context.lastFieldId && lastError.visited;
      }

      return false;
   }

   explore(context, instance) {
      var {data, lastError} = instance;
      let c1 = instance.cache('lastErrorMessage', lastError.message);
      let c2 = instance.cache('lastErrorFieldId', lastError.fieldId);
      if (c1 || c2) {
         data.errorMessage = lastError.message;
         data.fieldId = lastError.fieldId;
         instance.markShouldUpdate(context);
      }
      super.explore(context, instance);
   }

   render(context, instance, key) {
      var {data} = instance;
      return <label key={key} className={data.classNames} htmlFor={data.fieldId}>
         {data.errorMessage}
      </label>
   }
}

ValidationError.prototype.baseClass = 'validationerror';
ValidationError.prototype.styled = true;

Widget.alias('validation-error', ValidationError);
