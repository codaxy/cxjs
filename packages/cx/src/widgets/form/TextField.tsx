/** @jsxImportSource react */

import { Widget, getContent } from "../../ui/Widget";
import { Field, FieldConfig, getFieldTooltip } from "./Field";
import { BooleanProp, NumberProp, Prop, StringProp } from "../../ui/Prop";
import { Instance } from "../../ui/Instance";

export interface TextFieldConfig extends FieldConfig {
   value?: Prop<any>;
   placeholder?: StringProp;
   disabled?: BooleanProp;
   readOnly?: BooleanProp;
   required?: BooleanProp;
   minLength?: NumberProp;
   maxLength?: NumberProp;
   validationRegExp?: Prop<RegExp>;
   validationErrorText?: StringProp;
   minLengthValidationErrorText?: StringProp;
   maxLengthValidationErrorText?: StringProp;
   reactOn?: StringProp;
   inputType?: StringProp;
   keyboardShortcut?: StringProp;
   trim?: BooleanProp;
   hideClear?: BooleanProp;
   showClear?: BooleanProp;
   alwaysShowClear?: BooleanProp;
   icon?: Prop<any>;
   inputAttrs?: Prop<any>;
   onChange?: string | ((value: any, instance: Instance) => void);
   onInput?: string | ((value: any, instance: Instance) => void);
   onFocus?: string | ((e: FocusEvent, instance: Instance) => void);
   onBlur?: string | ((e: FocusEvent, instance: Instance) => void);
}

// Legacy alias for backward compatibility
export interface TextFieldProps extends TextFieldConfig {}

import {
   tooltipParentWillReceiveProps,
   tooltipParentWillUnmount,
   tooltipMouseMove,
   tooltipMouseLeave,
   tooltipParentDidMount,
} from "../overlay/tooltip-ops";
import { stopPropagation, preventDefault } from "../../util/eventCallbacks";
import { StringTemplate } from "../../data/StringTemplate";
import { Icon } from "../Icon";
import { KeyCode } from "../../util/KeyCode";
import { Localization } from "../../ui/Localization";
import ClearIcon from "../icons/clear";
import { autoFocus } from "../autoFocus";
import { isString } from "../../util/isString";
import { getActiveElement } from "../../util/getActiveElement";
import { VDOM } from "../../ui/VDOM";

export class TextField<Config extends TextFieldConfig = TextFieldConfig> extends Field<Config> {
   public hideClear?: boolean;
   public showClear?: boolean;
   public alwaysShowClear?: boolean;
   public validationRegExp?: RegExp;
   public validationErrorText?: string;
   public minLengthValidationErrorText?: string;
   public maxLengthValidationErrorText?: string;
   public reactOn!: string;
   public inputType?: string;
   public keyboardShortcut?: string;
   public trim?: boolean;

   public init(): void {
      if (typeof this.hideClear !== "undefined") this.showClear = !this.hideClear;

      if (this.alwaysShowClear) this.showClear = true;

      super.init();
   }

   public declareData(...args: any[]): void {
      super.declareData(
         {
            value: this.emptyValue,
            disabled: undefined,
            readOnly: undefined,
            enabled: undefined,
            placeholder: undefined,
            required: undefined,
            minLength: undefined,
            maxLength: undefined,
            icon: undefined,
            trim: undefined,
         },
         ...args,
      );
   }

   public renderInput(context: any, instance: any, key?: any): any {
      return (
         <Input
            key={key}
            instance={instance}
            data={instance.data}
            label={this.labelPlacement && getContent(this.renderLabel(context, instance, "label"))}
            help={this.helpPlacement && getContent(this.renderHelp(context, instance, "help"))}
            icon={this.renderIcon(context, instance, "icon")}
         />
      );
   }

   public validate(context: any, instance: any): void {
      super.validate(context, instance);

      let { data } = instance;

      if (!data.error && data.value) {
         if (this.validationRegExp) this.validationRegExp.lastIndex = 0;
         if (this.validationRegExp && !this.validationRegExp.test(data.value)) data.error = this.validationErrorText;
         else if (typeof data.value === "string" && data.minLength != null && data.value.length < data.minLength)
            data.error = StringTemplate.format(this.minLengthValidationErrorText, data.minLength, data.value.length);
         else if (typeof data.value === "string" && data.maxLength != null && data.value.length > data.maxLength)
            data.error = StringTemplate.format(this.maxLengthValidationErrorText, data.maxLength, data.value.length);
      }
   }
}

TextField.prototype.baseClass = "textfield";
TextField.prototype.reactOn = "change input blur enter";
TextField.prototype.inputType = "text";
TextField.prototype.validationErrorText = "The entered value is not valid.";
TextField.prototype.minLengthValidationErrorText = "Enter {[{0}-{1}]} more character(s).";
TextField.prototype.maxLengthValidationErrorText = "Use {0} characters or fewer.";
TextField.prototype.suppressErrorsUntilVisited = true;
TextField.prototype.icon = null;
TextField.prototype.showClear = false;
TextField.prototype.alwaysShowClear = false;
TextField.prototype.keyboardShortcut = "false";
TextField.prototype.trim = false;

Localization.registerPrototype("cx/widgets/TextField", TextField);

class Input extends VDOM.Component<any, any> {
   public input?: HTMLInputElement;

   constructor(props: any) {
      super(props);
      this.state = {
         focus: false,
      };
   }

   render(): any {
      let { instance, data, label, help, icon: iconVDOM } = this.props;
      let { widget, state } = instance;
      let { CSS, baseClass, suppressErrorsUntilVisited } = widget;

      let icon = iconVDOM && (
         <div
            className={CSS.element(baseClass, "left-icon")}
            onMouseDown={preventDefault}
            onClick={(e: any) => this.onChange((e.target as any).value, "enter")}
         >
            {iconVDOM}
         </div>
      );

      let insideButton;
      if (
         widget.showClear &&
         !data.empty &&
         !data.readOnly &&
         !data.disabled &&
         (widget.alwaysShowClear || !data.required)
      ) {
         insideButton = (
            <div
               className={CSS.element(baseClass, "clear")}
               onMouseDown={(e: any) => e.preventDefault()}
               onClick={(e: any) => this.onClearClick(e)}
            >
               <ClearIcon className={CSS.element(baseClass, "icon")} />
            </div>
         );
      }

      let empty = this.input ? !this.trimmed(this.input.value) : data.empty;

      return (
         <div
            className={CSS.expand(
               data.classNames,
               CSS.state({
                  visited: state.visited,
                  focus: this.state.focus,
                  icon: !!icon,
                  clear: insideButton != null,
                  empty: empty && !data.placeholder,
                  error: data.error && (state.visited || !suppressErrorsUntilVisited || !empty),
               }),
            )}
            style={data.style}
            onMouseDown={stopPropagation}
            onTouchStart={stopPropagation}
         >
            <input
               ref={(el: HTMLInputElement | null) => {
                  this.input = el || undefined;
               }}
               className={CSS.expand(CSS.element(baseClass, "input"), data.inputClass)}
               defaultValue={data.value}
               id={data.id}
               style={data.inputStyle}
               type={widget.inputType}
               disabled={data.disabled}
               readOnly={data.readOnly}
               tabIndex={data.tabIndex}
               placeholder={data.placeholder}
               {...data.inputAttrs}
               onMouseMove={this.onMouseMove.bind(this)}
               onMouseLeave={this.onMouseLeave.bind(this)}
               onInput={(e: any) => this.onChange(e.target.value, "input")}
               onChange={(e: any) => this.onChange((e.target as any).value, "change")}
               onKeyDown={this.onKeyDown.bind(this)}
               onFocus={this.onFocus.bind(this)}
               onBlur={this.onBlur.bind(this)}
               onClick={stopPropagation}
            />
            {insideButton}
            {icon}
            {label}
            {help}
         </div>
      );
   }

   onFocus(): void {
      let { instance, data } = this.props;
      let { widget } = instance;
      if (widget.trackFocus) {
         this.setState({
            focus: true,
         });
         instance.set("focused", true);
      }
      if (data.error && data.value) instance.setState({ visited: true });
   }

   onBlur(e: any): void {
      if (this.state.focus) {
         this.setState({
            focus: false,
         });
         this.props.instance.set("focused", false);
      }
      this.onChange((e.target as any).value, "blur");
   }

   onClearClick(_e: any): void {
      if (this.input) this.input.value = ""; // prevent onChange call with old text value on blur or component unmount
      this.props.instance.set("value", this.props.instance.widget.emptyValue, { immediate: true });
   }

   onMouseMove(e: any): void {
      const tooltip = getFieldTooltip(this.props.instance);
      tooltipMouseMove(e, tooltip[0], tooltip[1], tooltip[2]);
   }

   onMouseLeave(e: any): void {
      const tooltip = getFieldTooltip(this.props.instance);
      tooltipMouseLeave(e, tooltip[0], tooltip[1], tooltip[2]);
   }

   componentDidMount(): void {
      const tooltip = getFieldTooltip(this.props.instance);
      tooltipParentDidMount(this.input, tooltip[0], tooltip[1], tooltip[2]);
      autoFocus(this.input, this);
   }

   componentDidUpdate(): void {
      autoFocus(this.input, this);
   }

   componentWillUnmount(): void {
      if (this.input == getActiveElement() && this.input && this.input.value != this.props.data.value)
         this.onChange(this.input.value, "blur");
      tooltipParentWillUnmount(this.props.instance);
   }

   onKeyDown(e: any): void {
      let { instance } = this.props;
      if (instance.widget.handleKeyDown(e, instance) === false) return;

      switch (e.keyCode) {
         case KeyCode.enter:
            this.onChange(e.target.value, "enter");
            break;

         case KeyCode.left:
         case KeyCode.right:
            e.stopPropagation();
            break;
      }
   }

   UNSAFE_componentWillReceiveProps(props: any): void {
      let { data } = props;
      // The second check is required for debouncing, sometimes the value in the store lags after the input
      // and update may be caused by some other property, i.e. visited
      if (this.input && data.value != this.input.value && data.value != this.props.data.value)
         this.input.value = data.value || "";
      const tooltip = getFieldTooltip(props.instance);
      tooltipParentWillReceiveProps(this.input, tooltip[0], tooltip[1], tooltip[2]);
   }

   onChange(textValue: any, change: string): void {
      let { instance, data } = this.props;

      let immediate = change == "blur" || change == "enter";

      if (immediate) {
         instance.setState({ visited: true });
      }

      let { widget } = instance;

      if (widget.reactOn.indexOf(change) != -1) {
         let text = this.trimmed(textValue);
         if (data.maxLength != null && text.length > data.maxLength) {
            text = text.substring(0, data.maxLength);
            if (this.input) this.input.value = text;
         }

         let value = text || widget.emptyValue;
         if (!instance.set("value", value, { immediate })) {
            if (this.input && text != this.input.value && immediate) this.input.value = text;
         } else {
            if (value) instance.setState({ visited: true });
         }
      }
   }

   trimmed(value: any): any {
      if (this.props.data.trim && isString(value)) return value.trim();
      return value;
   }
}

Widget.alias("textfield", TextField);
