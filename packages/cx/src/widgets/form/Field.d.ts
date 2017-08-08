import * as Cx from '../../core';
import { Instance } from '../../ui';

export interface FieldProps extends Cx.StyledContainerProps {
   
   /** Field label. For advanced use cases. */
   label?: Cx.StringProp | Cx.Config,

   /** Set to `material` to use custom label placement instruction. Used in Material theme to implement animated labels. */
   labelPlacement?: 'material',

   /** Set to `material` to use custom help placement instruction. Used in Material theme to implement absolutely positioned validation messages. */
   helpPlacement?: 'material',
   
   /* Deprecated */
   labelWidth?: any,

   /** Either `view` or `edit` (default). In `view` mode, the field is displayed as plain text. */
   mode?: Cx.Prop<'view' | 'edit'>,

   /** Set to `true` to switch to widget view mode. Same as `mode="view". Default is false. */
   viewMode?: Cx.BooleanProp,

   id?: Cx.Prop<string | number>,
   
   /** Used for validation. If error evaluates to non-null, the field is marked in red. */
   error?: Cx.StringProp,

   /** Style object applied to the input element. Used for setting visual elements, such as borders and backgrounds. */
   inputStyle?: Cx.StyleProp,

   /** Additional attributes that should be rendered on the input element. E.g. inputAttrs={{ autoComplete: "off" }}. */
   inputAttrs?: Cx.Config,
   
   /** Text to be rendered in view mode when the field is empty. */
   emptyText?: Cx.StringProp,

   /** Set to `true` to make error indicators visible in pristine state. By default, validation errors are not shown until the user visits the field. */
   visited?: Cx.BooleanProp,

   /** Set to `true` to automatically focus the field, after it renders for the first time. */
   autoFocus?: Cx.BooleanProp,

   /** Defines how to present validation errors. Default mode is `tooltip`. Other options are `help` and `help-block`. */
   validationMode?: 'tooltip' | 'help' | 'help-block',

   /** Defaults to `false`. Set to `true` to disable the field. */
   disabled?: Cx.BooleanProp,

   /** Defaults to `false`. Used to make the field required. */
   required?: Cx.BooleanProp,

   /** Renamed to suppressErrorsUntilVisited. Used to indicate that required fields should not be marked as invalid before the user visits them. */
   suppressErrorTooltipsUntilVisited?: boolean,

   /** Error message used to indicate that field is required. */
   requiredText?: string,

   /** Append asterisk to the label to indicate a required field. */
   asterisk?: boolean,

   /** Text displayed to the user to indicate that server-side validation is in progress. */
   validatingText?: string,

   /** Text displayed to the user to indicate that server-side validation has thrown an exception. */
   validationExceptionText?: string,

   /** Configuration of the toolitp used to indicate validation errors. */
   errorTooltip?: Cx.Config,

   /** Tooltip configuration. */
   tooltip?: Cx.StringProp | Cx.StructuredProp
   
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
   help?: string | Cx.Config,

   /** Custom validation function. */
   onValidate?: string | ((value, instance: Instance) => any),

   onValidationException?: string | ((error: any, instance: Instance) => void)
}

export class Field extends Cx.Widget<FieldProps> {}
