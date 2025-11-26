import { TooltipConfig, TooltipOptions, TooltipParentInstance } from "../overlay/tooltip-ops";
import { isSelector } from "../../data/isSelector";
import { FocusManager } from "../../ui/FocusManager";
import { Instance, PartialInstance } from "../../ui/Instance";
import { Localization } from "../../ui/Localization";
import { PureContainerBase, PureContainerConfig } from "../../ui/PureContainer";
import type { RenderingContext } from "../../ui/RenderingContext";
import { getContent, WidgetStyleConfig } from "../../ui/Widget";
import { coalesce } from "../../util/coalesce";
import { Console } from "../../util/Console";
import { stopPropagation } from "../../util/eventCallbacks";
import { isPromise } from "../../util/isPromise";
import { isUndefined } from "../../util/isUndefined";
import { parseStyle } from "../../util/parseStyle";
import { shallowEquals } from "../../util/shallowEquals";
import { tooltipMouseLeave, tooltipMouseMove } from "../overlay/tooltip-ops";
import { FieldIcon } from "./FieldIcon";
import { HelpText } from "./HelpText";
import { Label } from "./Label";
import { ValidationError } from "./ValidationError";
import { BooleanProp, ClassProp, Config, Prop, StringProp, StructuredProp, StyleProp } from "../../ui/Prop";
import type { TooltipInstance } from "../overlay";

export interface FieldConfig extends PureContainerConfig, WidgetStyleConfig {
   /** Field label. For advanced use cases. */
   label?: StringProp | Config;

   /** Set to `material` to use custom label placement instruction. Used in Material theme to implement animated labels. */
   labelPlacement?: "material";

   /** Set to `material` to use custom help placement instruction. Used in Material theme to implement absolutely positioned validation messages. */
   helpPlacement?: "material";

   /** Either `view` or `edit` (default). In `view` mode, the field is displayed as plain text. */
   mode?: Prop<"view" | "edit">;

   /** Set to `true` to switch to widget view mode. Same as `mode="view"`. Default is false. */
   viewMode?: BooleanProp;

   id?: Prop<string | number>;

   /** Used for validation. If error evaluates to non-null, the field is marked in red. */
   error?: StringProp;

   /** Style object applied to the input element. Used for setting visual elements, such as borders and backgrounds. */
   inputStyle?: StyleProp;

   /** Additional CSS class applied to the input element. Used for setting visual elements, such as borders and backgrounds. */
   inputClass?: ClassProp;

   /** Additional attributes that should be rendered on the input element. E.g. inputAttrs={{ autoComplete: "off" }}. */
   inputAttrs?: Config;

   /** Text to be rendered in view mode when the field is empty. */
   emptyText?: StringProp;

   /** Set to `true` to make error indicators visible in pristine state. By default, validation errors are not shown until the user visits the field. */
   visited?: BooleanProp;

   /** Set to `true` to automatically focus the field, after it renders for the first time. */
   autoFocus?: BooleanProp;

   /** Defines how to present validation errors. Default mode is `tooltip`. Other options are `help` and `help-block`. */
   validationMode?: "tooltip" | "help" | "help-block";

   /** Defaults to `false`. Set to `true` to disable the field. */
   disabled?: BooleanProp;

   /** Defaults to `false`. Used to make the field required. */
   required?: BooleanProp;

   /** Used to indicate that required fields should not be marked as invalid before the user visits them. */
   suppressErrorsUntilVisited?: boolean;

   /** Error message used to indicate that field is required. */
   requiredText?: string;

   /** Append asterisk to the label to indicate a required field. */
   asterisk?: BooleanProp;

   /** Text displayed to the user to indicate that server-side validation is in progress. */
   validatingText?: string;

   /** Text displayed to the user to indicate that server-side validation has thrown an exception. */
   validationExceptionText?: string;

   /** Configuration of the tooltip used to indicate validation errors. */
   errorTooltip?: Config;

   /** Tooltip configuration. */
   tooltip?: StringProp | StructuredProp;

   /** Indicates that `help` should be separated from the input with a whitespace. Default is `true`. */
   helpSpacer?: boolean;

   /** If set to `true` top level element will get additional CSS class indicating that input is focused. Default is `false`. */
   trackFocus?: boolean;

   /** Custom tab index */
   tabIndex?: StringProp;

   /** Additional content to be displayed next to the field. */
   help?: string | Config;

   /** Custom validation function. */
   onValidate?: string | ((value: unknown, instance: Instance, validationParams: Record<string, unknown>) => unknown);

   /** Validation parameters to be passed to the validation function. */
   validationParams?: Config;

   onValidationException?: string | ((error: unknown, instance: FieldInstance) => void);

   /** Value to be set in the store if the field is empty. Default value is null. */
   emptyValue?: unknown;

   /** Additional CSS style to be passed to the label object. */
   labelStyle?: StyleProp;

   /** Additional CSS class to be passed to the label object. */
   labelClass?: ClassProp;
}

export class FieldInstance<F extends Field<any, any> = Field<any, any>>
   extends Instance<F>
   implements TooltipParentInstance
{
   declare state: Record<string, any>;
   declare parentDisabled?: boolean;
   declare parentReadOnly?: boolean;
   declare parentViewMode?: string;
   declare parentTabOnEnterKey?: boolean;
   declare parentVisited?: boolean;
   declare tooltips: { [key: string]: TooltipInstance };
}

export class Field<
   Config extends FieldConfig = FieldConfig,
   InstanceType extends FieldInstance<any> = FieldInstance<any>,
> extends PureContainerBase<Config, InstanceType> {
   declare public inputStyle?: Record<string, unknown> | string;
   declare public validationMode?: string;
   declare public errorTooltip?: Record<string, unknown>;
   declare public tooltip?: TooltipConfig;
   declare public help?: Record<string, unknown> | string;
   declare public label?: Record<string, unknown> | string;
   declare public mod?: Record<string, unknown>;
   declare public disabled?: boolean;
   declare public required?: boolean;
   declare public asterisk?: boolean;
   declare public labelStyle?: Record<string, unknown> | string;
   declare public labelClass?: string;
   declare public icon?: null | string;
   declare public visited?: boolean;
   declare public labelPlacement?: string;
   declare public helpPlacement?: string;
   declare public emptyValue?: unknown;
   declare public requiredText?: string;
   declare public validatingText?: string;
   declare public onValidate?: string | ((value: unknown, instance: Instance, validationParams: Record<string, unknown>) => unknown);
   declare public validationExceptionText?: string;
   declare public onValidationException?: string | ((error: unknown, instance: Instance) => void);
   declare public onKeyDown?: string | ((e: React.KeyboardEvent, instance: Instance) => boolean | void);
   declare public suppressErrorsUntilVisited?: boolean;
   declare public autoFocus?: boolean;
   declare public helpSpacer?: string;
   declare public trackFocus?: boolean;
   declare public baseClass: string;

   public declareData(...args: Record<string, unknown>[]): void {
      super.declareData(
         {
            label: undefined,
            labelWidth: undefined,
            mode: undefined,
            viewMode: undefined,
            id: undefined,
            error: undefined,
            inputStyle: { structured: true },
            inputClass: { structured: true },
            inputAttrs: { structured: true },
            emptyText: undefined,
            visited: undefined,
            autoFocus: undefined,
            tabOnEnterKey: undefined,
            tabIndex: undefined,
            validationParams: { structured: true },
         },
         ...args,
      );
   }

   public init(): void {
      this.inputStyle = parseStyle(this.inputStyle);
      super.init();
   }

   public initComponents(_context: RenderingContext, instance: Instance): void {
      if (this.validationMode == "tooltip" && isUndefined(this.errorTooltip)) {
         this.errorTooltip = {
            text: { bind: "$error" },
            mod: "error",
            ...(this.errorTooltip || {}),
         };
      }

      if (isUndefined(this.help)) {
         switch (this.validationMode) {
            case "help":
            case "help-inline":
               this.help = ValidationError as any;
               break;

            case "help-block":
               this.help = {
                  type: ValidationError as any,
                  mod: "block",
               };
               break;
         }
      }

      if (this.help != null) {
         let helpConfig: any = {};

         if ((this.help as any).isComponentType) helpConfig = this.help;
         else if (isSelector(this.help)) helpConfig.text = this.help;
         else Object.assign(helpConfig, this.help);

         this.help = HelpText.create(helpConfig) as any;
      }

      if (this.label != null) {
         let labelConfig: any = {
            mod: this.mod,
            disabled: this.disabled,
            required: this.required,
            asterisk: this.asterisk,
            style: this.labelStyle,
            class: this.labelClass,
         };

         if ((this.label as any).isComponentType) labelConfig = this.label;
         else if (isSelector(this.label)) labelConfig.text = this.label;
         else Object.assign(labelConfig, this.label);

         this.label = Label.create(labelConfig) as any;
      }

      if (this.icon != null) {
         let iconConfig: any = {
            className: this.CSS.element(this.baseClass, "icon"),
         };
         if (isSelector(this.icon)) iconConfig.name = this.icon;
         else Object.assign(iconConfig, this.icon);

         this.icon = FieldIcon.create(iconConfig) as any;
      }

      super.initComponents({
         label: this.label,
         help: this.help,
         icon: this.icon,
      });
   }

   public initState(_context: RenderingContext, instance: InstanceType): void {
      instance.state = {
         inputError: false,
         visited: this.visited === true,
      };
   }

   public prepareData(context: RenderingContext, instance: InstanceType, ...args: Record<string, unknown>[]): void {
      let { data, state } = instance;
      if (!data.id) data.id = "fld-" + instance.id;

      data._disabled = data.disabled;
      data._readOnly = data.readOnly;
      data._viewMode = data.mode === "view" || data.viewMode;
      data._tabOnEnterKey = data.tabOnEnterKey;
      data.validationValue = this.getValidationValue(data);
      instance.parentDisabled = context.parentDisabled;
      instance.parentReadOnly = context.parentReadOnly;
      instance.parentViewMode = context.parentViewMode;
      instance.parentTabOnEnterKey = context.parentTabOnEnterKey;
      instance.parentVisited = context.parentVisited;

      if (typeof data.enabled !== "undefined") data._disabled = !data.enabled;

      this.disableOrValidate(context, instance);

      data.inputStyle = parseStyle(data.inputStyle);

      if (this.labelPlacement && this.label) data.mod = [data.mod, "label-placement-" + this.labelPlacement];

      if (this.helpPlacement && this.help) data.mod = [data.mod, "help-placement-" + this.helpPlacement];

      data.empty = this.isEmpty(data);

      super.prepareData(context, instance);
   }

   protected disableOrValidate(context: RenderingContext, instance: Instance): void {
      let { data, state } = instance;

      //if the parent is strict and sets some flag to true, it is not allowed to overrule that flag by field settings

      data.disabled = coalesce(
         context.parentStrict ? context.parentDisabled : null,
         data._disabled,
         context.parentDisabled,
      );
      data.readOnly = coalesce(
         context.parentStrict ? context.parentReadOnly : null,
         data._readOnly,
         context.parentReadOnly,
      );
      data.viewMode = coalesce(
         context.parentStrict ? context.parentViewMode : null,
         data._viewMode,
         context.parentViewMode,
      );
      data.tabOnEnterKey = coalesce(
         context.parentStrict ? context.parentTabOnEnterKey : null,
         data._tabOnEnterKey,
         context.parentTabOnEnterKey,
      );
      data.visited = coalesce(context.parentStrict ? context.parentVisited : null, data.visited, context.parentVisited);

      if (!data.error && !data.disabled && !data.viewMode) this.validate(context, instance);

      if (data.visited && !state?.visited) {
         //feels hacky but it should be ok since we're in the middle of a new render cycle
         state!.visited = true;
      }

      data.stateMods = {
         ...data.stateMods,
         disabled: data.disabled,
         "edit-mode": !data.viewMode,
         "view-mode": data.viewMode,
      };
   }

   explore(context: RenderingContext, instance: InstanceType): void {
      let { data, state } = instance;

      instance.parentDisabled = context.parentDisabled;
      instance.parentReadOnly = context.parentReadOnly;
      instance.parentViewMode = context.parentViewMode;
      instance.parentTabOnEnterKey = context.parentTabOnEnterKey;
      instance.parentVisited = context.parentVisited;

      if (
         instance.cache("parentDisabled", context.parentDisabled) ||
         instance.cache("parentReadOnly", context.parentReadOnly) ||
         instance.cache("parentViewMode", context.parentViewMode) ||
         instance.cache("parentTabOnEnterKey", context.parentTabOnEnterKey) ||
         instance.cache("parentVisited", context.parentVisited)
      ) {
         (instance as any).markShouldUpdate(context);
         this.disableOrValidate(context, instance);
         this.prepareCSS(context, instance);
      }

      if (!context.validation)
         context.validation = {
            errors: [],
         };

      if (data.error) {
         context.validation.errors.push({
            fieldId: data.id,
            message: data.error,
            visited: state?.visited,
            type: "error",
         });
      }

      context.push("lastFieldId", data.id);
      super.explore(context, instance);
   }

   exploreCleanup(context: RenderingContext, instance: Instance): void {
      context.pop("lastFieldId");
   }

   isEmpty(data: Record<string, unknown>): boolean {
      return data.value == null || data.value === this.emptyValue;
   }

   validateRequired(context: RenderingContext, instance: Instance): string | undefined {
      let { data } = instance;
      if (this.isEmpty(data)) return this.requiredText;
   }

   getValidationValue(data: Record<string, unknown>): unknown {
      return data.value;
   }

   validate(context: RenderingContext, instance: Instance): void {
      let { data } = instance;
      let state = instance.state || {};

      let empty = this.isEmpty(data);

      if (!data.error) {
         if (state.inputError) data.error = state.inputError;
         else if (state.validating && !empty) data.error = this.validatingText;
         else if (
            state.validationError &&
            data.validationValue === state.lastValidatedValue &&
            shallowEquals(data.validationParams, state.lastValidationParams)
         )
            data.error = state.validationError;
         else if (data.required) data.error = this.validateRequired(context, instance);
      }

      if (
         !empty &&
         !state.validating &&
         !data.error &&
         this.onValidate &&
         (!state.previouslyValidated ||
            data.validationValue != state.lastValidatedValue ||
            data.validationParams != state.lastValidationParams)
      ) {
         let result = instance.invoke("onValidate", data.validationValue, instance, data.validationParams);
         if (isPromise(result)) {
            data.error = this.validatingText;
            instance.setState({
               validating: true,
               lastValidatedValue: data.validationValue,
               previouslyValidated: true,
               lastValidationParams: data.validationParams,
            });
            result
               .then((r) => {
                  let { data, state } = instance;
                  let error =
                     data.validationValue == state?.lastValidatedValue &&
                     shallowEquals(data.validationParams, state?.lastValidationParams)
                        ? r
                        : this.validatingText; //parameters changed, this will be revalidated

                  instance.setState({
                     validating: false,
                     validationError: error,
                  });
               })
               .catch((e) => {
                  instance.setState({
                     validating: false,
                     validationError: this.validationExceptionText,
                  });
                  if (this.onValidationException) instance.invoke("onValidationException", e, instance);
                  else {
                     Console.warn("Unhandled validation exception:", e);
                  }
               });
         } else {
            data.error = result;
         }
      }
   }

   renderLabel(context: RenderingContext, instance: Instance, key: string): React.ReactNode {
      if (instance.components?.label) return getContent(instance.components.label.vdom);
   }

   renderInput(context: RenderingContext, instance: Instance, key: string): React.ReactNode {
      throw new Error("Not implemented.");
   }

   renderHelp(context: RenderingContext, instance: Instance, key: string): React.ReactNode {
      if (instance.components?.help) return getContent(instance.components.help.render(context));
   }

   renderIcon(context: RenderingContext, instance: Instance, key: string): React.ReactNode {
      if (instance.components?.icon) return getContent(instance.components.icon.render(context));
   }

   formatValue(context: RenderingContext, { data }: Instance): string | React.ReactNode {
      return data.text || data.value;
   }

   renderValue(context: RenderingContext, instance: FieldInstance, key?: string | number): React.ReactNode {
      let text = this.formatValue(context, instance as Instance);
      if (text) {
         return (
            <span
               key={key}
               onMouseMove={(e: any) => {
                  const tooltip = getFieldTooltip(instance);
                  if (tooltip) (tooltipMouseMove as any)(e, tooltip, null, null);
               }}
               onMouseLeave={(e: any) => {
                  const tooltip = getFieldTooltip(instance);
                  if (tooltip) (tooltipMouseLeave as any)(e, tooltip, null, null);
               }}
            >
               {text}
            </span>
         );
      }
   }

   protected renderContent(context: RenderingContext, instance: FieldInstance, key: string): React.ReactNode {
      let content = this.renderValue(context, instance, key) || this.renderEmptyText(context, instance, key);
      return this.renderWrap(context, instance, key, content);
   }

   protected renderWrap(
      context: RenderingContext,
      instance: Instance,
      key: string,
      content: React.ReactNode,
   ): React.ReactNode {
      let { data } = instance;
      let interactive = !data.viewMode && !data.disabled;
      return (
         <div
            key={key}
            className={data.classNames}
            style={data.style}
            onMouseDown={interactive ? stopPropagation : undefined}
            onTouchStart={interactive ? stopPropagation : undefined}
         >
            {content}
            {this.labelPlacement && this.renderLabel(context, instance, "label")}
         </div>
      );
   }

   protected renderEmptyText(_context: RenderingContext, { data }: Instance, key: string): React.ReactNode {
      return (
         <span key={key} className={this.CSS.element(this.baseClass, "empty-text")}>
            {data.emptyText || <span>&nbsp;</span>}
         </span>
      );
   }

   public render(context: RenderingContext, instance: InstanceType, key: string): Record<string, React.ReactNode> {
      let { data } = instance;
      let content = !data.viewMode
         ? this.renderInput(context, instance, key)
         : this.renderContent(context, instance, key);

      return {
         label: !this.labelPlacement && this.renderLabel(context, instance, key),
         content: content,
         helpSpacer: this.helpSpacer && instance.components?.help ? " " : undefined,
         help: !this.helpPlacement && this.renderHelp(context, instance, key),
      };
   }

   public handleKeyDown(e: React.KeyboardEvent, instance: Instance): boolean | void {
      if (this.onKeyDown && instance.invoke("onKeyDown", e, instance) === false) return false;

      if (instance.data.tabOnEnterKey && e.keyCode === 13) {
         let target = e.target;
         setTimeout(() => {
            if (!instance.state?.inputError) (FocusManager as any).focusNext(target);
         }, 10);
      }
   }
}

Field.prototype.validationMode = "tooltip";
Field.prototype.suppressErrorsUntilVisited = false;
Field.prototype.requiredText = "This field is required.";
Field.prototype.autoFocus = false;
Field.prototype.asterisk = false;
Field.prototype.validatingText = "Validation is in progress...";
Field.prototype.validationExceptionText = "Something went wrong during input validation. Check log for more details.";
Field.prototype.helpSpacer = "true";
Field.prototype.trackFocus = false; //add cxs-focus on parent element
Field.prototype.labelPlacement = "false";
Field.prototype.helpPlacement = "false";
Field.prototype.emptyValue = null;
Field.prototype.styled = true;

//These flags are inheritable and should not be set to false
//Field.prototype.visited = null;
//Field.prototype.disabled = null;
//Field.prototype.readOnly = null;
//Field.prototype.viewMode = null;

Localization.registerPrototype("cx/widgets/Field", Field);

export function getFieldTooltip(
   instance: FieldInstance<any>,
): [FieldInstance<any>, TooltipConfig, TooltipOptions | undefined] {
   let { widget, data, state } = instance;

   if (widget.errorTooltip && data.error && (!state || state.visited || !widget.suppressErrorsUntilVisited))
      return [
         instance,
         widget.errorTooltip,
         {
            data: {
               $error: data.error,
            },
         },
      ];
   return [instance, widget.tooltip!, undefined];
}
