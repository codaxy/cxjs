import * as Cx from '../../core';

export interface FieldProps extends Cx.StyledContainerProps {
   
   /** Field label. For advanced use cases. */
   label?: Cx.StringProp | Cx.Config,
   
   /** TODO : Check type */
   labelWidth?: any,

   /** Either `view` or `edit` (default). In `view` mode, the field is displayed as plain text. */
   mode?: Cx.Prop<'view' | 'edit'>,

   id?: Cx.Prop<string | number>,
   
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
   validationMode?: 'tooltip' | 'help' | 'help-block',

   /** Defaults to `false`. Set to `true` to disable the field. */
   disabled?: Cx.BooleanProp,

   /** Defaults to `false`. Used to make the field required. */
   required?: Cx.BooleanProp,

   suppressErrorTooltipsUntilVisited?: boolean,
   requiredText?: string,
   asterisk?: boolean,
   validatingText?: string,
   validationExceptionText?: string,
   errorTooltip?: string
   
   /** Indicates that `help` should be separated from the input with a whitespace. Default is `true`. */
   helpSpacer?: boolean,
   
   /** 
    * If set to `true` top level element will get additional CSS class indicating that input is focused. 
    * Used for adding special effects on focus. Default is `false`. 
    */
   trackFocus?: boolean,

   /** 
    * Additional content to be displayed next to the field. 
    * This is commonly used for presenting additional information or validation errors. 
    */
   help?: Cx.Config

}

export class Field extends Cx.Widget<FieldProps> {}
