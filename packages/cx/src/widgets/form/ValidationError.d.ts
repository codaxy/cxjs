import * as Cx from '../../core';

interface ValidationErrorProps extends Cx.WidgetProps {

   /** Base CSS class to be applied to the field. Defaults to `validationerror`. */
   baseClass?: boolean,

}

export class ValidationError extends Cx.Widget<ValidationErrorProps> {}
