import * as Cx from '../../core';

export interface FieldProps extends Cx.StyledContainerProps {
   
   /** Field label. For advanced use cases, see Labels. */
   label?: Cx.StringProp,

   labelWidth?: Cx.NumberProp,
   mode?: any, // TODO: check type
   id?: string | number | Cx.Binding | Cx.Selector<string | number>,
   
   /** Used for validation. If error evaluates to non-null, the field is marked in red. */
   error?: Cx.StringProp,

   /** Style object applied to the input element. Used for setting visual elements, such as borders and backgrounds. */
   inputStyle?: Cx.StyleProp,

   /** Additional attributes that should be rendered on the input element. E.g. inputAttrs={{ autoComplete: "off" }}. */
   inputAttrs?: Cx.Config,
   
   /** Text to be rendered in view mode when the field is empty. */
   emptyText?: Cx.StringProp,

   /** Validation errors are not shown until the user visits the field. Setting this field to `true` will cause that 
    * validation error indicators become visible immediately. */
   visited?: Cx.BooleanProp,

   /** Set to `true` to automatically focus the field, after it renders for the first time. */
   autoFocus?: Cx.BooleanProp,

   /** Defines how to present validation errors. Default mode is `tooltip`. Other options are `help` and `help-block`. */
   validationMode?: 'tooltip' | 'help' | 'help-block';
}

export class Field extends Cx.Widget<Cx.FieldProps> {}
