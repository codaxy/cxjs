import { TooltipConfig, TooltipOptions, TooltipParentInstance } from "../overlay/tooltip-ops";
import { isSelector } from "../../data/isSelector";
import { FocusManager } from "../../ui/FocusManager";
import { Instance, PartialInstance } from "../../ui/Instance";
import { Localization } from "../../ui/Localization";
import { PureContainerBase, PureContainerConfig } from "../../ui/PureContainer";
import type { RenderingContext } from "../../ui/RenderingContext";
import { getContent } from "../../ui/Widget";
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
import { BooleanProp, Prop, StringProp, StyleProp } from "../../ui/Prop";
import type { TooltipInstance } from "../overlay";

export interface FieldConfig extends PureContainerConfig {
   inputStyle?: StyleProp;
   validationMode?: StringProp;
   errorTooltip?: Prop<Record<string, unknown>>;
   tooltip?: Prop<TooltipConfig>;
   help?: Prop<Record<string, unknown> | string>;
   label?: Prop<Record<string, unknown> | string>;
   mod?: Prop<Record<string, unknown>>;
   disabled?: BooleanProp;
   required?: BooleanProp;
   asterisk?: BooleanProp;
   labelStyle?: StyleProp;
   labelClass?: StringProp;
   icon?: Prop<null | string>;
   visited?: BooleanProp;
   labelPlacement?: StringProp;
   helpPlacement?: StringProp;
   emptyValue?: Prop<unknown>;
   requiredText?: StringProp;
   validatingText?: StringProp;
   onValidate?: string | ((value: unknown, instance: Instance, validationParams: Record<string, unknown>) => unknown);
   validationExceptionText?: StringProp;
   onValidationException?: string | ((error: unknown, instance: FieldInstance) => void);
   onKeyDown?: string | ((e: React.KeyboardEvent, instance: FieldInstance) => boolean | void);
   suppressErrorsUntilVisited?: BooleanProp;
   autoFocus?: BooleanProp;
   helpSpacer?: StringProp;
   trackFocus?: BooleanProp;
}

export class FieldInstance<F extends Field<any, any> = Field<any, any>>
   extends Instance<F>
   implements TooltipParentInstance
{
   declare state: Record<string, any>;
   parentDisabled?: boolean;
   parentReadOnly?: boolean;
   parentViewMode?: string;
   parentTabOnEnterKey?: boolean;
   parentVisited?: boolean;
   tooltips: { [key: string]: TooltipInstance };
}

export class Field<
   Config extends FieldConfig = FieldConfig,
   InstanceType extends FieldInstance<any> = FieldInstance<any>,
> extends PureContainerBase<Config, InstanceType> {
   public inputStyle?: Record<string, unknown> | string;
   declare public validationMode?: string;
   public errorTooltip?: Record<string, unknown>;
   public tooltip?: TooltipConfig;
   public help?: Record<string, unknown> | string;
   public label?: Record<string, unknown> | string;
   public mod?: Record<string, unknown>;
   public disabled?: boolean;
   public required?: boolean;
   declare public asterisk?: boolean;
   public labelStyle?: Record<string, unknown> | string;
   public labelClass?: string;
   public icon?: null | string;
   public visited?: boolean;
   declare public labelPlacement?: string;
   declare public helpPlacement?: string;
   declare public emptyValue?: unknown;
   declare public requiredText?: string;
   declare public validatingText?: string;
   public onValidate?:
      | string
      | ((value: unknown, instance: Instance, validationParams: Record<string, unknown>) => unknown);
   declare public validationExceptionText?: string;
   public onValidationException?: string | ((error: unknown, instance: Instance) => void);
   public onKeyDown?: string | ((e: React.KeyboardEvent, instance: Instance) => boolean | void);
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
