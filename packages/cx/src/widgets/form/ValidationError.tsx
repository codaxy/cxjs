/** @jsxImportSource react */

import type { Instance } from "../../ui/Instance";
import type { RenderingContext } from "../../ui/RenderingContext";
import { Widget } from "../../ui/Widget";

interface ValidationErrorData {
   visible?: boolean;
   classNames?: string;
   fieldId?: string;
   errorMessage?: string;
   style?: Record<string, string | number> | string;
}

interface ValidationErrorInstance extends Instance {
   lastError?: {
      fieldId: string;
      message: string;
      visited: boolean;
      type: string;
   };
   data: ValidationErrorData;
}

export class ValidationError extends Widget {
   checkVisible(context: RenderingContext, instance: ValidationErrorInstance, data: ValidationErrorData): boolean {
      if (
         data.visible &&
         context.lastFieldId &&
         context.validation &&
         context.validation.errors &&
         context.validation.errors.length > 0
      ) {
         var lastError = (instance.lastError = context.validation.errors[context.validation.errors.length - 1]);
         return lastError.fieldId == context.lastFieldId && lastError.visited;
      }

      return false;
   }

   explore(context: RenderingContext, instance: ValidationErrorInstance): void {
      var { data, lastError } = instance;
      let c1 = instance.cache("lastErrorMessage", lastError?.message);
      let c2 = instance.cache("lastErrorFieldId", lastError?.fieldId);
      if (c1 || c2) {
         data.errorMessage = lastError?.message;
         data.fieldId = lastError?.fieldId;
         instance.markShouldUpdate(context);
      }
      super.explore(context, instance);
   }

   render(context: RenderingContext, instance: ValidationErrorInstance, key: string): React.ReactElement {
      var { data } = instance;
      return (
         <label
            key={key}
            className={data.classNames as string}
            htmlFor={data.fieldId}
            style={data.style as React.CSSProperties}
         >
            {data.errorMessage}
         </label>
      );
   }
}

ValidationError.prototype.baseClass = "validationerror";
ValidationError.prototype.styled = true;

Widget.alias("validation-error", ValidationError);
