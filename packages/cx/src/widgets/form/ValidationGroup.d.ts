import * as Cx from '../../core';

export interface ValidationGroupProps extends Cx.PureContainerProps {
   
   /** Binding used to store validation errors in the store. */
   errors?: Cx.Record[],

   /** Binding which will be set to true if all child form field are valid. */
   valid?: Cx.BooleanProp,

   /** Binding which will be set to true if any of child form field reports validation error. */
   invalid?: Cx.BooleanProp,

   /** Set to `false` to disable all inner elements that support `disabled` property. */
   enabled?: Cx.BooleanProp,

   /** Set to `true` to disable all inner elements that support `disabled` property. */
   disabled?: Cx.BooleanProp,

   /** Set to `true` to make read-only all inner elements that support `readOnly` property. */
   readOnly?: Cx.BooleanProp,

   /** Set to `true` to isolate children from participating in outer validation scopes. */
   isolated?: Cx.BooleanProp
}

export class ValidationGroup extends Cx.Widget<ValidationGroupProps> {}
